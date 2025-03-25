const mongoose = require("mongoose");

const electricityBillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      ],
    },
    otherBoardName: {
      type: String,
      required: function () {
        return this.electricityBoard === "Other";
      },
      trim: true,
    },
    consumerNumber: {
      type: String,
      required: true,
      trim: true,
    },
    billNumber: {
      type: String,
      required: true,
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
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Net Banking", "Credit Card", "Debit Card"],
      default: "UPI",
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

// Auto-calculate totalAmount before saving
electricityBillSchema.pre("save", function (next) {
  this.totalAmount = this.amountDue + this.lateFee;
  next();
});

// Making consumerNumber unique per electricity board
electricityBillSchema.index({ consumerNumber: 1, electricityBoard: 1 }, { unique: true });

export const ElectricityBillPayment = mongoose.model(
  "ElectricityBillPayment",
  electricityBillSchema
);
