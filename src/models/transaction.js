const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    quantityBought: {
      type: Number,
      required: true,
      min: 1,
    },

    type: {
      type: String,
      enum: ["sale", "restock"],
      required: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
