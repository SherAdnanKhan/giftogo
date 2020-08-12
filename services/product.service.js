const shopify = require("../lib/shopify");

const { error } = require("../errors");

// get product by product id
const getProductById = async (productId) => {
  try {
    const product = await shopify.product.get(productId);
    console.log("shopify product", product);
    return product;
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

// fetch all products
const getAllProducts = async () => {
  try {
    const params = { limit: 10 };
    const products = await shopify.product.list(params);
    console.log("shopify products list", products);
    return products;
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

module.exports = {
  getProductById,
  getAllProducts,
};
