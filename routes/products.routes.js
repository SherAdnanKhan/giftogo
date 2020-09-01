const express = require("express");
const proudctRouter = express.Router();

const product = require("../controller/products.controller");

proudctRouter.post("/products", product.list);

proudctRouter.get("/product/:id", product.get);

proudctRouter.post("/add/product", product.add);

module.exports = proudctRouter;
