const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "XAF",
    },

    txRef: {
      type: String,
      required: true,
      unique: true,
    },

    transactionId: {
      type: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESSFUL", "FAILED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
