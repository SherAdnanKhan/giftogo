const shopify = require("../lib/shopify");
const { error } = require("../errors");

const getOrderById = async (orderId) => {
  try {
    const order = await shopify.order.get(orderId);
    return order;
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};


module.exports = {
  getOrderById,
};
