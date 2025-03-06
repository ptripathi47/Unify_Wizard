const mongoose = require("mongoose");

const electricityBillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user making the payment
      required: true,
    },
    electricityBoard: {
      type: String,
      required: true,
      enum: [
        "Tata Power",
        "BSES Rajdhani",
        "BSES Yamuna",
        "Adani Electricity",
        "MSEDCL",
        "CESC",
        "UPPCL",
        "WBSEDCL",
        "Other",
      ], // Add more electricity boards as needed
    },
    consumerNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    billNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    billDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    amountDue: {
      type: Number,
      required: true,
      min: 0,
    },
    lateFee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Net Banking", "Credit Card", "Debit Card"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    paymentDate: {
      type: Date,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values while enforcing uniqueness
    },
  },
  { timestamps: true }
);

export const ElectricityBillPayment = mongoose.model("ElectricityBillPayment", electricityBillSchema);
