
import mongoose from 'mongoose';

const temporaryUserSchema = new mongoose.Schema({
  phone: { 
    type: String, 
    required: true,
    unique: true // ✅ Ek phone number ek hi baar register ho
  },
  otp: { 
    type: String, 
    required: true 
  },
  otpExpiry: { 
    type: Date, 
    required: true 
  },

  // ✅ Temporary Storage for Verification
  aadhaar: {
    number: { type: String, unique: true },
    email: {type: String},
    dob : {type : Date},
    name : {type: String },
    address: {type: String},
    isVerified: { type: Boolean, default: false }
  },
  pan: {
    number: { type: String, unique: true },
    isVerified: { type: Boolean, default: false }
  },
  isPhoneVerified: { type: Boolean, default: false },
  gender : {type : String},

  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: '1h' // ✅ Auto-delete after 1 hour
  }
});

const TemporaryUser = mongoose.model('TemporaryUser', temporaryUserSchema);

export default TemporaryUser;
