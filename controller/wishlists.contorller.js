const wishlistsService = require("../services/wishlists.service");

const add = async (req, res) => {
  try {
    const { product_id, user_id } = req.body;
    const product_add = await wishlistsService.addProductToWishList(product_id, user_id);
    res.status(200).json(product_add);
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
};

const remove = async (req, res) => {
  try {
    const { product_id, user_id } = req.body;
    const product_remove = await wishlistsService.removeProductToWishList(product_id, user_id);
    res.status(200).json(product_remove);
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
};

module.exports = {
  add,
  remove,
};
