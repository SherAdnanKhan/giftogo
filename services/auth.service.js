const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Shopify = require("shopify-api-node");

const { APP_SECRET } = process.env;

const { User } = require("../models");
const { error } = require("../errors");

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_SHOP_NAME,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_API_PASS,
});

// create new user
const createUser = async (_user) => {
  try {
    const { email, password, password2 } = _user;
    //  Check if user exists
    let user = await User.findAll({ where: { email }, limit: 1 });
    if (user.length) {
      throw new error("User already exists", 400);
    }
    // Check if passwords are same
    if (password !== password2) {
      throw new error("Password does not match.", 400);
    }
    //   creating new user
    user = await User.create;
    userBody = {
      email,
      password,
    };
    //  Encrypt Password
    const salt = await bcrypt.genSalt(10);
    userBody.password = await bcrypt.hash(password, salt);
    // Save user to Database
    user = await User.create(userBody);

    // create shopify customer
    const createdCustomer = await shopify.customer.create(_user);
    console.log("shopify createdCustomer", createdCustomer);

    //  Send jsonwebtoken
    const payload = {
      user: {
        id: user.dataValues.id,
      },
    };
    const token = jwt.sign(payload, APP_SECRET, { expiresIn: 36000 });
    return token;
  } catch (e) {
    throw new error(e.message, 500);
  }
};

module.exports = {
  createUser,
};
