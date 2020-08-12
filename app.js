require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const createError = require("http-errors");
const port = parseInt(process.env.PORT, 10) || 8080;

// Set up the express app
const app = express();
app.use(cors());
// Log requests to the console.
app.use(logger("dev"));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const model = require("./models");

app.use(require('./routes/auth.routes'));
app.use(require('./routes/product.routes'));

app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, _next) {
  console.log("ERROR: ", err);
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : "internal server error" });
});

model.sequelize
  .sync({
    force: false,
    //alter: true // please do not remove this alter
  })
  .then((connection) => {
    app.listen(port, () => {
      console.log(`Server started on ${port}`);
    });
  });
