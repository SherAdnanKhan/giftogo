const express = require("express");
const vendRouter = express.Router();

const vendorController = require("../controller/vendor.controller");


// vendor get account 
vendRouter.get("/vendor/account", vendorController.getAccount);
vendRouter.get("/vendor/products", vendorController.getProducts);
vendRouter.get("/vendor/payouts", vendorController.getPayouts);
vendRouter.put("/vendor/account", vendorController.updateAccount);
vendRouter.put("/vendor/logo", vendorController.updateLogo);
vendRouter.get("/search-by-brand/:search", vendorController.getSearchByBrands);



module.exports = vendRouter;
