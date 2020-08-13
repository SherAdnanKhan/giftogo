const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { APP_SECRET } = process.env;

const shopify = require("../lib/shopify");

const { User } = require("../models");
const { error } = require("../errors");

// login user service
const loginUser = async (_user) => {
  const { email, password } = _user;
  //  Check if user exists
  let user = await User.findAll({ where: { email }, limit: 1 });
  if (!user.length) {
    throw new error("Invalid Credentials", 400);
  }
  const isMatch = await bcrypt.compare(password, user[0].dataValues.password);
  if (!isMatch) {
    throw new error("Invalid Credentials", 400);
  }
  //  Send jsonwebtoken
  const payload = {
    user: {
      id: user[0].dataValues.id,
    },
  };
  const token = jwt.sign(payload, APP_SECRET, { expiresIn: 36000 });
  return token;
};

// create new user service
const createUser = async (_user) => {
  const { first_name, last_name, email, password, password_confirmation } = _user;
  //  Check if user exists
  let user = await User.findAll({ where: { email }, limit: 1 });
  if (user.length) {
    throw new error("User already exists", 400);
  }
  // Check if passwords are same
  if (password !== password_confirmation) {
    throw new error("Password does not match.", 400);
  }
  const userBody = {
    first_name,
    last_name,
    email,
    password,
  };
  //  Encrypt Password
  const salt = await bcrypt.genSalt(10);
  userBody.password = await bcrypt.hash(password, salt);
  // Save user to Database
  user = await User.create(userBody);

  // create shopify customer
  const customer = {
    customer: _user,
  };
  const shopifyCustomer = await shopify.customer.create(customer);
  console.log("shopify createdCustomer", shopifyCustomer);

  //   //  Send jsonwebtoken
  const payload = {
    user: {
      id: user.dataValues.id,
    },
  };
  const token = jwt.sign(payload, APP_SECRET, { expiresIn: 36000 });
  return token;
};

module.exports = {
  createUser,
  loginUser,
};
