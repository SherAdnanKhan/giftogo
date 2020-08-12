const express = require("express");
const proudctRouter = express.Router();

const product = require("../controller/product.controller");

proudctRouter.post("/product", product.list);

proudctRouter.get("/product/:id", product.get);

module.exports = proudctRouter;