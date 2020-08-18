const shopify = require("../lib/shopify");
const paginate = require("../util/paginate.util");

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

module.exports = {
  getProductById,
  productsList,
};
