const express = require("express");
const authRouter = express.Router();

const auth = require("../controller/auth.controller");


// login user
authRouter.post("/user/login", auth.loginUser);
// create users
authRouter.post("/user/create", auth.createUser);

// login vendor
authRouter.post("/vendor/login", auth.loginVendor);
// create vendors
authRouter.post("/vendor/create", auth.createVendor);
//forget vendors
authRouter.post("/vendor/forgot", auth.forgotVendor);
authRouter.post("/vendor/resetpass", auth.resetPasswordVendor);
authRouter.post("/vendor/verify", auth.accountVerification);

module.exports = authRouter;
