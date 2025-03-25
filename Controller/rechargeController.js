import axios from "axios";  
import { MobileRecharge } from "../Model/mobileRechargeSchema.js";
import { Wallet } from "../Model/wallet.js";
// 🔹 Method for checking number details
const checkNumberDetails = async (mobile) => {
    try {
        const regex = /^[6789]\d{9}$/;
        if (!regex.test(mobile)) {
            return { success: false, message: "Invalid Mobile Number" };
        }

        const response = await axios.get(`https://api.truecaller.com/check?number=${mobile}`);
        return response.data;

    } catch (error) {
        console.error("Error:", error.message);
        return { success: false, message: "Error checking number details" };
    }
};

// 🔹 Fetch Operator & Available Plans
export const getNumberDetailsAndPlans = async (req, res) => {
    try {
        const { mobile } = req.body;
        
        // ✅ Step 1: Validate Mobile Number
        const numberDetails = await checkNumberDetails(mobile);
        if (!numberDetails.success) {
            return res.status(400).json({ success: false, statusCode: 400, message: numberDetails.message });
        }

        // ✅ Get Operator Details (NumVerify)
        const numVerifyResponse = await axios.get(`http://apilayer.net/api/validate`, {
            params: { access_key: process.env.NUMVERIFY_API_KEY, number: mobile, country_code: "IN" }
        });

        if (!numVerifyResponse.data.valid) {
            return res.status(400).json({ success: false, statusCode: 400, message: "Invalid Number" });
        }
        const operator = numVerifyResponse.data.carrier;

        // ✅ Fetch Recharge Plans (EzyTM)
        const rechargeResponse = await axios.get(`https://api.ezytm.com/recharge-plans`, {
            params: { mobile, operator, apiKey: process.env.RECHARGE_API_KEY }
        });

        const plans = rechargeResponse.data.plans;

        if (!plans || plans.length === 0) {
            return res.status(404).json({ success: false, statusCode: 404, message: "No plans available" });
        }

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Available recharge plans",
            operator: operator, // ✅ Operator add kiya
            plans: plans
        });

    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, statusCode: 500, message: "API Error fetching plans" });
    }
};

// 🔹 Method to Recharge Number
const rechargeNumber = async (mobile, amount, operator) => {
    try {
        const response = await axios.post(`https://api.ezytm.com/recharge`, {
            apiKey: process.env.RECHARGE_API_KEY,
            number: mobile,
            amount,
            operator,
            txn_id: `TXN_${Date.now()}`
        });

        return response.data;

    } catch (error) {
        console.error("Recharge Error:", error.message);
        return { success: false, message: "Recharge API Error" };
    }
};

// 🔥 **Final MobileRecharge Controller**
// 🔥 **Modified MobileRecharge Controller**
export const MobileRecharge = async (req, res) => {
    try {
        const { userId, mobile, amount, operator, paymentMode } = req.body;

        if (!userId || !mobile || !amount || !operator || !paymentMode) {
            return res.status(400).json({ success: false, statusCode: 400, message: "All fields are required" });
        }

        // ✅ Step 1: Validate Mobile Number
        const numberDetails = await checkNumberDetails(mobile);
        if (!numberDetails.success) {
            return res.status(400).json({ success: false, statusCode: 400, message: numberDetails.message });
        }

        // ✅ Step 2: Check Wallet Balance
        const userWallet = await Wallet.findOne({ userId });
        if (!userWallet) {
            return res.status(400).json({ success: false, statusCode: 400, message: "Wallet not found" });
        }

        if (userWallet.balance < amount) {
            return res.status(400).json({ success: false, statusCode: 400, message: "Insufficient Wallet Balance" });
        }

        // ✅ Step 3: Deduct Amount from Wallet
        userWallet.balance -= amount;
        userWallet.transactions.push({
            transactionId: `TXN_${Date.now()}`,
            type: "Debit",
            amount,
            paymentMode,
            category: "Mobile Recharge",
            description: `Recharge for ${mobile}`,
            status: "Pending",
        });

        await userWallet.save(); // ✅ Update Wallet in DB

        // ✅ Step 4: Process Recharge
        const rechargeResponse = await rechargeNumber(mobile, amount, operator);
        if (!rechargeResponse.success) {
            // ❌ Recharge Failed - Refund Wallet Balance
            userWallet.balance += amount;
            userWallet.transactions.push({
                transactionId: `REFUND_${Date.now()}`,
                type: "Credit",
                amount,
                paymentMode: "Wallet",
                category: "Refund",
                description: `Refund for failed recharge of ${mobile}`,
                status: "Success",
            });

            await userWallet.save(); // ✅ Update Wallet after refund

            return res.status(500).json({ success: false, statusCode: 500, message: "Recharge Failed", error: rechargeResponse.message });
        }

        // ✅ Step 5: Update Recharge Status in Wallet
        const lastTransaction = userWallet.transactions.find(txn => txn.description === `Recharge for ${mobile}`);
        if (lastTransaction) {
            lastTransaction.status = "Success";
        }

        await userWallet.save(); // ✅ Update Wallet Transaction Status

        // ✅ Step 6: Save Recharge in DB
        const newRecharge = new MobileRecharge({
            userId,
            phoneNumber: mobile,
            serviceProvider: operator,
            amount,
            paymentMode,
            transactionId: rechargeResponse.txn_id,
            status: "Success",
        });

        await newRecharge.save();

        // ✅ Step 7: Send Success Response
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Recharge Successful",
            rechargeDetails: rechargeResponse
        });

    } catch (error) {
        console.error("MobileRecharge Error:", error);
        return res.status(500).json({ success: false, statusCode: 500, message: "Internal Server Error", error: error.message });
    }
};

export const getRechargeHistory = async (req, res) => {
    try {
        const { userId } = req.body;  // ✅ Frontend se userId milega

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // ✅ Find all recharges for the user (Latest first)
        const recharges = await MobileRecharge.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Recharge history fetched successfully",
            data: recharges
        });

    } catch (error) {
        console.error("Error fetching recharge history:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export const checkWalletBalance = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // ✅ Get User's Wallet Balance
        const userWallet = await Wallet.findOne({ userId });

        if (!userWallet) {
            return res.status(400).json({ success: false, message: "Wallet not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Wallet balance fetched successfully",
            balance: userWallet.balance
        });

    } catch (error) {
        console.error("Error checking wallet balance:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};