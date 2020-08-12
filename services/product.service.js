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
    const products = await shopify.product.list();
    console.log("shopify products list", products);
    return products;
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

// fetch products list
const productsList = async (params) => {
  try {
    params.limit = params.limit ? params.limit : 10;
    const products = await shopify.product.list(params);
    return {
      products,
      next: products.nextPageParameters,
      previous: products.previousPageParameters,
    };
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

module.exports = {
  getProductById,
  getAllProducts,
  productsList
};
