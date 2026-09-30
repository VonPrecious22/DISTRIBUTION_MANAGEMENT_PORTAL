const axios = require("axios");

const Order = require("../models/order");
const User = require("../models/user");
const Payment = require("../models/payment");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const initiatePayment = async (orderId, buyerId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw createError("Order not found.", 404);
  }

  if (order.buyer.toString() !== buyerId.toString()) {
    throw createError("You are not allowed to pay for this order.", 403);
  }

  if (order.status !== "PAYMENT_PENDING") {
    throw createError("This order is not waiting for payment.", 400);
  }

  const buyer = await User.findById(buyerId);

  if (!buyer) {
    throw createError("Buyer not found.", 404);
  }

  if (!process.env.NOTCHPAY_PUBLIC_KEY) {
    throw createError("NOTCHPAY_PUBLIC_KEY is missing from .env", 500);
  }

  if (!process.env.APP_URL) {
    throw createError("APP_URL is missing from .env", 500);
  }

  const reference = "order-" + order._id + "-" + Date.now();

  const amount = Math.round(order.totalAmount);

  const payment = await Payment.create({
    order: order._id,
    buyer: buyerId,
    amount: amount,
    currency: "XAF",
    txRef: reference,
    status: "PENDING",
  });

  try {
    const response = await axios.post(
      "https://api.notchpay.co/payments",
      {
        amount: amount,
        currency: "XAF",

        customer: {
          name: buyer.name,
          email: buyer.email,
          phone: buyer.contact,
        },

        description: "Payment for Order " + order._id,

        callback: process.env.APP_URL + "/buyer/payment/callback",

        reference: reference,
      },
      {
        headers: {
          Authorization: process.env.NOTCHPAY_PUBLIC_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    const transaction = response.data.transaction;

    if (!transaction) {
      throw createError("Payment transaction was not created.", 502);
    }

    payment.transactionId = transaction.reference;

    await payment.save();

    const paymentUrl = response.data.authorization_url;

    if (!paymentUrl) {
      throw createError("Payment URL was not created.", 502);
    }

    return paymentUrl;
  } catch (error) {
    payment.status = "FAILED";
    await payment.save();

    if (error.statusCode) {
      throw error;
    }

    throw createError("Could not start the payment. Please try again.", 502);
  }
};

const verifyPayment = async (reference) => {
  let payment = await Payment.findOne({
    txRef: reference,
  });

  if (!payment) {
    payment = await Payment.findOne({
      transactionId: reference,
    });
  }

  if (!payment) {
    throw createError("Payment not found.", 404);
  }

  if (payment.status === "SUCCESSFUL") {
    return payment;
  }

  if (!process.env.NOTCHPAY_PUBLIC_KEY) {
    throw createError("NOTCHPAY_PUBLIC_KEY is missing from .env", 500);
  }

  try {
    const notchpayReference = payment.transactionId || reference;

    const response = await axios.get(
      `https://api.notchpay.co/payments/${notchpayReference}`,
      {
        headers: {
          Authorization: process.env.NOTCHPAY_PUBLIC_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    const transaction = response.data.transaction;

    if (!transaction) {
      throw createError("Payment transaction was not found.", 502);
    }

    if (transaction.status === "complete") {
      payment.status = "SUCCESSFUL";

      payment.transactionId = transaction.reference;

      await payment.save();

      const order = await Order.findById(payment.order);

      if (order) {
        order.status = "PAID";
        await order.save();
      }
    } else {
      payment.status = "FAILED";
      await payment.save();
    }

    return payment;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    throw createError("Could not verify the payment.", 502);
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
};
