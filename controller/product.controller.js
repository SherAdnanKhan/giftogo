const productService = require("../services/product.service");

const get = async (req, res) => {
  try {
    const { id } = req.params;
    const product = productService.getProductById(id);
    res.status(200).json(product);
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
};

const getAll = async (req, res) => {
  try {
    const products = productService.getAllProducts();
    res.status(200).json(products);
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
};

module.exports = {
  get,
  getAll,
};
