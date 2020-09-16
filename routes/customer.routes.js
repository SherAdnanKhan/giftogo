const express = require("express");
const customerRouter = express.Router();

const customerController = require("../controller/customer.controller");

// update users
customerRouter.post("/user/updateAccount", customerController.updateAccount);


module.exports = customerRouter;