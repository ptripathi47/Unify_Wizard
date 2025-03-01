import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true
  },
  Address: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is Required!"],
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  PAN: {
    type: String,
    required: [true , "PAN Number is required"], 
    unique: true,
  },
  aadhar:{
    type: String,
    required: [true, "Aadhar Number is required"],
    unique: true,
    minLength: [12 , "Aadhar Number should be of 12 digits"],
    maxLength: [12 , "Aadhar Number should be of 12 digits"]
  },
  phone: {
    type: String,
    required: [true, "Phone Is Required!"],
    minLength: [13, "Phone Number Must Contain Exact 10 Digits!"],
    maxLength: [13, "Phone Number Must Contain Exact 10 Digits!"]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  userProfile: {
    public_id: String,
    url: String,
  },
});

export const User = mongoose.model("User", userSchema);
