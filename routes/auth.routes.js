const express = require("express");
const authRouter = express.Router();

const auth = require("../controller/auth.controller");

// login user
authRouter.post("/user/login", auth.loginUser);
// create users
authRouter.post("/user/create", auth.createUser);

module.exports = authRouter;
