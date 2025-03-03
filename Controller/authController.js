import bcrypt from "bcrypt";
import lodash from "lodash";
import axios from "axios";
import { generatedOtp } from "../Utils/generateOTP.js";
import { User } from "../Model/userSchema.js";
import TemporaryUser from "../Model/temporaryUser.js";
import sendOtp from "../Utils/smsService.js";


export const MobileRegisteration = async (req , res , next) => {
    try {
        let {phone} = req.body;

        // Checking Valid Phone Number
        if (phone.length !== 13){
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Enter valid Phone Number"
            })
        }
        // 1. Checking for missing field (PHONE Number)
        if(!phone){
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Phone Number is required"
            })
    };
    
        // 2. Generate OTP and save temperory user
        const currentTime = Date.now();

        // Check if user already exists in TemporaryUser with a valid OTP
        const existingUser = await TemporaryUser.findOne({ phone });

        if (existingUser && existingUser.otpExpiry > currentTime) {
            const remainingTime = Math.ceil((existingUser.otpExpiry - currentTime) / 1000);
            return res.status(400).json({
                success: false,
                message: "Please wait, OTP is still valid.",
                remainingTime
            });
        }
        // Generate new OTP and set expiry time (2 minutes)
        const otp = generatedOtp();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 2);

        // Upsert (Insert if not exists, otherwise update)
        const savedTemporaryUser = await TemporaryUser.findOneAndUpdate(
            { phone },
            { otp, otpExpiry },
            { new: true, upsert: true }
        );

        // 3. Send OTP via Phone Number
        const message = `Welcome to Unify Wizard , Your Mobile verification Code is ${otp}. Do Not Share this Code with anyone.`
        await sendOtp(message , phone);
        
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "OTP sent successfully to registered Phone Number.",
            data: {phone , "otp" : otp} ,
        })
    } catch (error) {
        console.error("Error in signup:", error.message);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Server error in sending OTP : ${error.message}`
        });
    }
}

export const verifyOtp = async(req , res) => {

    try {
        const {phone , otp} = req.body;

        // 1. check for missing fields
        if(!otp){
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "OTP is required , Please Enter OTP"
            });
        }

        // 2. Finding temporary user for Phone Number
        const temporaryUser = await TemporaryUser.findOne({phone});
        if (!temporaryUser){
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "No OTP found for this Phone Number. Please register again."
            })
        }

        // 3. Check if OTP matches
        if(temporaryUser.otp !== otp){
            return res.status(400).json({
                success : false,
                statuscode: 400,
                message: "Invalid OTP. Please enter valid OTP"
            })
        }
    
        // 4. check if OTP has expired
        const currentTime = new Date();
        const otpExpiryTime = new Date(temporaryUser.otpExpiry);
        if (currentTime > otpExpiryTime) {
          return res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'OTP has expired. Please sign up again to receive a new OTP.',
          });
        }

        // 5. Mark user as verified in TemporaryUser
        temporaryUser.isVerified = true;
        await temporaryUser.save();

         // 6. Checking for phone number existence in User collection
         const user = await User.find({phone});
         if (user){
             return res.status(400).json({
                 success: true,
                 statusCode: 200,
                 message: "OTP Verified Successfully and User already registered",
                 data: user
             })
         }

         return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "OTP verified Successfully",
        })

     } catch (error) {
        console.error("Error in OTP verification:" , error.message);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Server Error: ${error.message}`,
        });
    }
};

export const aadharAuthentication= async (req , res , next) => {
   try {
    const {aadhar} = req.body;
     //1. checking for aadhar number
    if(!aadhar){
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Aadhar Number required"
        })
    }
     
    // 2. Checking for aadhar number length
    if(aadhar.length != 12){
        return res.status(400).json({
            success : false,
            statuscode: 400,
            message: "Enter 12 digit Aadhar Number"
        })
    }

    // Creating new User
    const newUser = await new User({

    })
    
    // Saving newUser
    
    await newUser.save()


    return res.status(200).json({
        success : true,
        statusCode: 200,
        message: "New user registered successfully",
        user: {
            id : newUser._id,
            name: newUser.name
        }
    })

    } catch (error) {
    console.error("Error in registeration of Aadhar Number", error.message);
    return res.status(500).json({
        success: false,
        statusCode: 500,
        message: `Server Error in registeration of Aadhar Number ${error.message}`
    })
   }
}

export const panNumber = async (req , res , next) => {
    try {
        const {PAN} = req.body;
        // 1. Checking for PAN Number 
        if (!PAN){
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "PAN Number is required"
            })
        }

        // 2. Checking for PAN Number length
        if(PAN.length != 10){
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "PAN Number must be of Characters"
            })
        }
    } catch (error) {
        console.error("Error in verification of PAN card number", error.message);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Server error in registeration of PAN card number ${error.message}`
        })
    }
}
