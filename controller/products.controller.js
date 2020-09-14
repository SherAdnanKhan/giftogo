const productService = require("../services/products.service");
const { tokenValidation } = require("../validator/token");
const { AddProductValidation } = require("../validator/product");

const get = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.status(200).json(product);
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
};

const list = async (req, res) => {
  try {
    const products = await productService.productsList(req.query);
    res.status(200).json(products);
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
};

const add = async (req, res) => {
  const vendor_id = await tokenValidation(req, res);
  try {
    await AddProductValidation(req);
    const product = await productService.addProduct(vendor_id, req.body);
    res.status(200).json(product);
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
}


module.exports = {
  get,
  list,
  add
};
