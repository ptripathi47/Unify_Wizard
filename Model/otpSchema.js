import mongoose from "mongoose";
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,  // Validate mobile number format (10 digits)
  },
  otp: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    default: Date.now,
    index: {expires: 300}, //After Five minutes OTP will expire after sending
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
}, {timestamps: true});

export const otp = mongoose.model('otp', otpSchema);
