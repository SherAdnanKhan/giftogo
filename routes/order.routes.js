const express = require("express");
const orderListRouter = express.Router();

const ordersContorller = require("../controller/orders.controller");

orderListRouter.get("/order/:id", ordersContorller.masking);
orderListRouter.get("/order/:orderId/:customerId", ordersContorller.getOrderBarCode);


module.exports = orderListRouter;
