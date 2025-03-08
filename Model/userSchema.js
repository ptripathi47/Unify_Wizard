import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dob: {  
    type: Date,
    required: true
  },
  address: {  
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is Required!"],
    unique: true,
    validate: [validator.isEmail, "Provide A Valid Email!"]
  },
  phone: {
    type: String,
    required: [true, "Phone is Required!"],
    unique: true,
    match: [/^\d{10}$/, "Phone Number Must Contain Exactly 10 Digits!"] //  Phone validation
  },

  // ✅ Aadhaar Verification Block
  aadhaar: {
    number: {
      type: String,
      required: [true, "Aadhaar Number is required"],
      unique: true,
      minLength: [12, "Aadhaar Number should be exactly 12 digits"],  //  Length check
      maxLength: [12, "Aadhaar Number should be exactly 12 digits"],  
      match: [/^\d{12}$/, "Aadhaar Number should contain only digits"] //  Regex check
    },
    isVerified: { type: Boolean, default: false },
    verificationDate: { type: Date , default : Date.now }
  },

  // ✅ PAN Verification Block
  pan: {
    number: {
      type: String,
      required: [true, "PAN Number is required"],
      unique: true,
      minLength: [10, "PAN Number should be exactly 10 characters"], //  Length check
      maxLength: [10, "PAN Number should be exactly 10 characters"], 
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Format"] //  PAN format check (ABCDE1234F)
    },
    isVerified: { type: Boolean, default: false },
    verificationDate: { type: Date , default : Date.now }
  },

  gender : {type : String},
  
  isVerified: {
    type: Boolean,
    default: false
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ✅ Indexing for faster search
userSchema.index({ email: 1, phone: 1, "aadhaar.number": 1, "pan.number": 1 });

export const User = mongoose.model("User", userSchema);
