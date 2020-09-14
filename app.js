require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fs = require('fs');
const cron = require("node-cron");
const cors = require("cors");
const createError = require("http-errors");
const port = parseInt(process.env.PORT, 10) || 8000;
const emailscraper =require('./cronjobs/emailScraper');
const processImage=require('./cronjobs/processImage');
// var url = require('url');
// Set up the express app
const app = express();
app.use(cors());

// Log requests to the console.
app.use(logger("dev"));

let date_ob = new Date();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

// console.log("Schedule a task on"+hours+minutes+seconds);
// const pathToFile = './emailScrapedImages/Image4472.png';

// fs.unlink(pathToFile, function(err) {
//   if (err) {
//     throw err
//   } else {
//     console.log("Successfully deleted the file.")
//   }
// })

// cron.schedule("00 */1 * * * *", function() {
//   console.log("Cron job perform a task on"+hours+minutes+seconds);
//   emailscraper.gettokenurl();
  
// });



// var urls = [
//     'http://domain.com:3000',
//     'http://domain.com?pass=gas',
//     'domain.com',
//     'http://domain.com',
//     'https://makecode.pk',
//     'https://www.makecode.pk',
//     'https://www.make.code.pk',
// ];

// for (x in urls) {
//     console.log(url.parse(urls[x]).hostname);
// }


// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json({limit: '20mb'}));
// app.use(express.json({limit: '100mb'}));
// app.use(express.urlencoded({limit: '100mb'}));
app.use(bodyParser.urlencoded({ extended: false }));

const model = require("./models");
const { auth } = require("googleapis/build/src/apis/abusiveexperiencereport");
app.use(require("./routes/auth.routes"));
app.use(require("./routes/products.routes"));
app.use(require("./routes/wishlists.routes"));
app.use(require("./routes/meta.routes"));
app.use(require("./routes/order.routes"));
app.use(require("./routes/vendor.routes"));
app.use(require("./routes/imageTest.routes"));

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, _next) {
  console.log("ERROR: ", err);
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : "internal server error" });
});
// app.listen(port, () => {
//   console.log(`Server started on ${port}`);
// });
model.sequelize
  .sync({
    force: false,
    //alter: true // please do not remove this alter
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on ${port}`);
    });
  });

  