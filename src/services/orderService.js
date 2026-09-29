const Order = require("../models/order");
const Product = require("../models/product");
const { generateOrderPDF } = require("../utils/pdfGenerator");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const createOrder = async (buyerId, items) => {
  const orderItems = [];
  let totalAmount = 0;

  for (const { productId, quantity } of items) {
    const product = await Product.findById(productId);

    if (!product){
      const error = new Error("Product not found.");
      error.statusCode = 400;
      throw error
    }

    if (product.quantity < quantity)
      throw createError(`Not enough stock of ${product.name}`, 400);

    const subtotal = product.price * quantity;
    totalAmount += subtotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      quantity,
      unitPrice: product.price,
      subtotal,
    });
  }

  const order = await Order.create({
    buyer: buyerId,
    items: orderItems,
    totalAmount,
  });
const populateName = await order.populate("buyer", "name email contact");
  populateName.pdfPath = await generateOrderPDF(populateName);
  await populateName.save();

  return populateName;
};



// all orders, for the manager
const getManagerOrder = async () => {
  return Order.find()
    .populate("buyer", "name email contact")
    .sort({ createdAt: -1 });
};

// orders belonging to one buyer
const getBuyerOrder = async (buyerId) => {
  return Order.find({ buyer: buyerId }).sort({ createdAt: -1 });
};

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId).populate(
    "buyer",
    "name email contact",
  );
  if (!order) throw createError("Order not found.", 404);
  return order;
};

const changeOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw createError("Order not found.", 404);

  order.status = status;
  return order.save();
};

const approveOrder = async (orderId) => {
  const order = await getOrderById(orderId);
  if (order.status !== "PENDING")
    throw createError("Only pending orders can be approved.", 400);

  return changeOrderStatus(orderId, "PAYMENT_PENDING");
};

const rejectOrder = async (orderId) => {
  const order = await getOrderById(orderId);
  if (order.status !== "PENDING")
    throw createError("Only pending orders can be rejected.", 400);

  return changeOrderStatus(orderId, "REJECTED");
};

module.exports = {
  createOrder,
  getBuyerOrder,
  getManagerOrder,
  getOrderById,
  approveOrder,
  rejectOrder,
};
