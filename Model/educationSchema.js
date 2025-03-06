const mongoose = require("mongoose");

const educationFeePaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the student or guardian making the payment
      required: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    institutionName: {
      type: String,
      required: true,
      trim: true,
    },
    institutionId: {
      type: String,
      required: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
    },
    totalFee: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    remainingFee: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Net Banking", "Credit Card", "Debit Card", "Loan", "Cash"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values while enforcing uniqueness
    },
    paymentDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const EducationFeePayment = mongoose.model("EducationFeePayment", educationFeePaymentSchema);
