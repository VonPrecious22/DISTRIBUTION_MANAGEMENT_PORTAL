const Payment = require("../models/payment");
const Order = require("../models/order");
const User = require("../models/user");
const axios = require("axios");

const errorMessage = (message, status) => {
  const error = new Error(message);
  error.statusCode = status;
  return error;
};

const innitiatePayment = async (buyerId, orderId) => {
  const order = await Order.findById(orderId);
  if (!order) return errorMessage("Unable to find Order.", 400);

  if(order.buyer.toString() !== buyerId.toString()) {
    return errorMessage("Payment can not be made to this order.", 400);
  }
  
  if(order.status !== "PAYMENT_PENDING"){
    return errorMessage("Payment not allowed Yet. Please try later", 400);
  }
  
  const buyer = await User.findById(buyerId);
  
  const reference = "order-" + order._id + "-" + Date.now();

  const payment = await Payment.create({
    buyer: buyerId,
    order: order._id,
    amount: order.totalAmount,
    currency: "XAF",
    txRef: reference,
  });


};
