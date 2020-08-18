
const { WishList } = require("../models");
const { error } = require("../errors");

const addProductToWishList = async (product_id, user_id) => {
  try {
    const wishBody = {
      product_id,
      user_id,
    };
    return await WishList.create(wishBody);
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

const removeProductToWishList = async (product_id, user_id) => {
  try {
    let wishElement = await WishList.findAll({ where: { product_id, user_id }, limit: 1 });
    if (wishElement.length) {
      return await WishList.destroy({ where: { product_id, user_id } });
    } else {
      throw new error("No Record found", 400);
    }
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

module.exports = {
  addProductToWishList,
  removeProductToWishList,
};