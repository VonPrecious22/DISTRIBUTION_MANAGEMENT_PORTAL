const {
  initiatePayment,
  verifyPayment,
} = require("../services/paymentService");

const startPayment = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const buyerId = req.session.user.id;

    const paymentUrl = await initiatePayment(orderId, buyerId);

    res.redirect(paymentUrl);
  } catch (error) {
    next(error);
  }
};

const paymentCallback = async (req, res, next) => {
  try {
    const reference = req.query.reference || req.query.tx_ref;

    if (!reference) {
      return res.status(400).send("Payment reference is missing.");
    }

    const payment = await verifyPayment(reference);

    if (payment.status === "SUCCESSFUL") {
      return res.redirect("/buyer/orders");
    }

    return res.status(400).send("Payment was not successful.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startPayment,
  paymentCallback,
};
