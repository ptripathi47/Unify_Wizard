const mongoose = require("mongoose");

const gstPaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who is paying GST
      required: true,
    },
    gstNumber: {
      type: String,
      required: true,
      match: [/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$/, "Invalid GST Number format"],
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    invoiceDate: {
      type: Date,
      required: true,
    },
    taxableAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    gstRate: {
      type: Number,
      required: true,
      enum: [5, 12, 18, 28], // GST slabs in India
    },
    gstAmount: {
      type: Number,
      required: true,
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
      sparse: true, // Allows null values without enforcing uniqueness on them
    },
  },
  { timestamps: true }
);

export const GSTPayment = mongoose.model("GSTPayment", gstPaymentSchema);
