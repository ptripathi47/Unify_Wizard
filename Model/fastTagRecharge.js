const mongoose = require("mongoose");

const fastagPaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user making the payment
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      match: [/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/, "Invalid vehicle number format"],
    },
    fastagId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    issuingBank: {
      type: String,
      required: true,
      enum: [
        "ICICI Bank",
        "HDFC Bank",
        "SBI Bank",
        "Axis Bank",
        "Paytm Payments Bank",
        "Kotak Mahindra Bank",
        "IDFC First Bank",
        "Other",
      ], // Add more issuing banks as needed
    },
    tollPlaza: {
      type: String,
      required: true,
    },
    tollLocation: {
      type: String,
      required: true,
    },
    tollAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceBefore: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["FASTag Wallet", "UPI", "Net Banking", "Credit Card", "Debit Card"],
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
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const FASTagPayment = mongoose.model("FASTagPayment", fastagPaymentSchema);
