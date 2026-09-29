const {
  createProduct,
  getAllProducts,
  updateProduct,
} = require("../services/productService");
const productForm = async (req, res) => {
  return res.render("manager/product/create", {
    inventoryId: req.params.inventoryId,
    error: null,
  });
};
const createNewProduct = async (req, res) => {
  try {
    const { inventoryId } = req.params;

    const product = await createProduct(inventoryId, req.body);
    return res.redirect(`/manager/inventory/${inventoryId}`);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .render("error/500", {
        error: "Something went wrong, please try again!!",
      });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();

    res.status(200).render("manager/product/index", { products });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .render("error/500", {
        error: "Something went wrong, Please try again!!",
      });
  }
};

const updateExistingProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await updateProduct(productId, req.body);

    return res.status(200).render("manager/product/index", {
      product,
    });
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    return res
      .status(status)
      .render("error/500", {
        error: "Something went wrong, Please again!!" || err.message,
      });
  }
};

module.exports = {
  productForm,
  createNewProduct,
  getProducts,
  updateExistingProduct,
};
