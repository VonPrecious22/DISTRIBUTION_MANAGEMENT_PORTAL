const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: string,
    enum: ["PENDING", "APPROVED", "REJECTED", "PAID", "COMPLETED"],
    default: "PENDING",
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1
 },
},{timestamps: true});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;