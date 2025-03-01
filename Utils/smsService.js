import twilio from "twilio";
import "dotenv/config";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken); // Initialize Twilio Client

const sendOtp = async (message, phoneNumber) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: twilioPhone,
            to: phoneNumber,
        });
        console.log("SMS Sent Successfully");
        return { success: true, sid: response.sid };
    } catch (error) {
        console.log("Error in sending OTP:", error.message);
        return { success: false, error: error.message };
    }
};

export default sendOtp;
