const orderService = require("../services/orderService");
const { getAllProducts } = require("../services/productService");
const { createOrderValidator } = require("../validator/orderValidator");

const buyerProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.render("buyer/product/index", { products: products, error: null });
  } catch (err) {
    console.log(err);
    res.status(500).render("error/500", { error: "Something went wrong." });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    const quantities = req.body.quantities;
    const items = [];
    for (const productId in quantities) {
      const quantity = Number(quantities[productId]);

      if (quantity > 0) {
        items.push({ productId: productId, quantity: quantity });
      }
    }
    // the buyer must select at least one product
    if (items.length === 0) {
      const products = await getAllProducts();
      return res.status(400).render("buyer/product/index", {
        products: products,
        error: "Please select at least one product.",
      });
    }
    // validate the items
    const { error } = createOrderValidator.validate({ items: items });
    if (error) {
      const products = await getAllProducts();
      return res.status(400).render("buyer/product/index", {
        products: products,
        error: error.details[0].message,
      });
    }

    // save the order
    await orderService.createOrder(req.session.user.id, items);
    res.redirect("/buyer/orders");
  } catch (err) {
    console.log(err);

    // errors we threw on purpose (like "not enough stock") go back to the form
    if (err.statusCode) {
      const products = await getAllProducts();
      return res.status(err.statusCode).render("buyer/product/index", {
        products: products,
        error: err.message,
      });
    }

    res.status(500).render("error/500", { error: "Something went wrong." });
  }
};

// Show the buyer's orders
const buyerOrders = async (req, res) => {
  try {
    const orders = await orderService.getBuyerOrder(req.session.user.id);
    res.render("buyer/orders", { orders: orders });
  } catch (err) {
    console.log(err);
    res.status(500).render("error/500", { error: "Something went wrong." });
  }
};

// Show one order to the buyer
const buyerOrderDetail = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.orderId);
    // a buyer can only see their own orders
    // if (
    //   !order.buyer ||
    //   order.buyer._id.toString() !== req.session.user.id.toString()
    // ) {
    //   return res.status(403).render("error/500", {
    //     error: "You are not allowed to view this order.",
    //   });
    // }
    res.render("buyer/orderDetail", { order: order });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).render("error/500", {
      error: "Something went wrong.",
    });
  }
};

//Manager

// Show all orders to the manager
const managerOrders = async (req, res) => {
  try {
    const orders = await orderService.getManagerOrder();
    res.render("manager/orders", { orders: orders });
  } catch (err) {
    console.log(err);
    res.status(500).render("error/500", { error: "Something went wrong." });
  }
};

// Show one order to the manager
const managerOrderDetail = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.orderId);
    res.render("manager/orderDetail", { order: order });
  } catch (err) {
    console.log(err);
    res.status(500).render("error/500", {
      error: "Something went wrong.",
    });
  }
};

// Approve an order
const approveOrder = async (req, res) => {
  try {
    await orderService.approveOrder(req.params.orderId);
    res.redirect("/manager/orders/" + req.params.orderId);
  } catch (err) {
    console.log(err);
    res.status(500).render("error/500", {
      error: "Something went wrong.",
    });
  }
};

// Reject an order
const rejectOrder = async (req, res) => {
  try {
    await orderService.rejectOrder(req.params.orderId);
    res.redirect("/manager/orders/" + req.params.orderId);
  } catch (err) {
    console.log(err);
    res.status(500).render("error/500", {
      error: "Something went wrong.",
    });
  }
};

module.exports = {
  buyerProducts,
  createOrder,
  buyerOrders,
  buyerOrderDetail,
  managerOrders,
  managerOrderDetail,
  approveOrder,
  rejectOrder,
};
