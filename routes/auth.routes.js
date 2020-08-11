const express = require("express");
const authRouter = express.Router();

const auth = require("../controller/auth.controller");


// create users
authRouter.post("/user/create", auth.createUser);


module.exports = authRouter;