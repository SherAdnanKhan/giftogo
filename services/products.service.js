const shopify = require("../lib/shopify");
const paginate = require("../util/paginate.util");
const https = require('https');

const { error } = require("../errors");

// get product by product id
const getProductById = async (productId) => {
  try {
    const product = await shopify.product.get(productId);
    return product;
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

// fetch products list
const productsList = async (params) => {
  const { limit = 10, page = 1 } = params;
  let listParams = { limit: 250 },
    productList = [];
  try {
    const count = await shopify.product.count();
    do {
      const shopifyProducts = await shopify.product.list(listParams);
      productList = [...productList, ...shopifyProducts];
      listParams = shopifyProducts.nextPageParameters;
    } while (listParams !== undefined);
    const products = paginate(productList, limit, page);
    return { count, products };
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

const getProductMetas = async (productId) => {
  try {
    const metaFieldList = await shopify.metafield.list({
      metafield: { owner_resource: 'products', owner_id: productId },
    });
    return metaFieldList;
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
}
const addProduct = async (_vendor_id, _product) => {
  try {
    const product = await shopify.product.create(_product);
    return product;

  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
}

module.exports = {
  getProductById,
  productsList,
  getProductMetas,
  addProduct
};
