import mongoose from 'mongoose';
const temporaryUserSchema = new mongoose.Schema({
  phone: { type: String, required: true},
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true }, 
});


const TemporaryUser = mongoose.model('TemporaryUser', temporaryUserSchema);

export default TemporaryUser;
