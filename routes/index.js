const express = require("express");
const app = express();
const routes = () => {
  app.use(require("./auth.routes"));
  app.use(require("./products.routes"));
  app.use(require("./wishlists.routes"));
  app.use(require("./imageTest.routes"));
}


module.exports = routes;