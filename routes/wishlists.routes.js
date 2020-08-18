const express = require("express");
const wishListRouter = express.Router();

const wishlistsContorller = require("../controller/wishlists.contorller");

wishListRouter.post("/wish-list/add", wishlistsContorller.add);

wishListRouter.post("/wish-list/remove", wishlistsContorller.remove);

module.exports = wishListRouter;
