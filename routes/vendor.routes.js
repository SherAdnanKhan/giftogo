const express = require("express");
const vendRouter = express.Router();

const vendorController = require("../controller/vendor.controller");


// vendor get account 
vendRouter.get("/vendor/account/:id", vendorController.getAccount);
vendRouter.put("/vendor/account/:id", vendorController.updateAccount);



module.exports = vendRouter;
