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
  try {
    // const metaFieldList = await shopify.metafield.list({
    //   metafield: { owner_resource: 'customers', owner_id: 3237975687202 },
    // });
    // console.log(metaFieldList);
    const shopifyCustomer = await shopify.customer.create(_user);
    console.log("shopify createdCustomer", shopifyCustomer);
    console.log("shopify createdCustomer Id", shopifyCustomer.id);
    return { message: "Customer created", response: shopifyCustomer, status: 200 };
  } catch (e) {
    console.log(e);
    throw new error(e.message, 405);
  }
  return { message: "Customer created", status: 400 };
};

module.exports = {
  createUser,
  loginUser,
};
