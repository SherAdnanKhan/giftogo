const express = require("express");
const metasController = require("../controller/metas.controller");
const MetaRouter = express.Router();


MetaRouter.post("/update-meta/:customerId", metasController.updateMetas);

module.exports = MetaRouter;
