const validator = require("../validator");

const auth = require("../services/auth.service");
const vendor_auth = require("../services/vendor-auth.service");


// login user
const loginUser = async (req, res) => {
  try {
    //await validator.signUser(req);
    const result = await auth.loginUser(req.body);
    return res.json(result);
  } catch (e) {
    console.log(e);
    res.status(e.status).json({ errors: e.data });
  }
};

// create users
const createUser = async (req, res) => {
  try {
    await validator.newUser(req);
    const result = await auth.createUser(req.body);
    return res.json(result);
  } catch (e) {
    console.log(e);
    res.status(e.status).json({ errors: e.data });
  }
};

// create vendors
const createVendor = async (req, res) => {
  try {
    await validator.newVendor(req);
    const result = await vendor_auth.createVendor(req.body);
    return res.json(result);
  } catch (e) {
    console.log(e);
    res.status(e.status).json({ errors: e.data });
  }
};

//login vendor
const loginVendor = async (req, res) => {
  try {
    await validator.signUser(req);
    const result = await vendor_auth.loginVendor(req.body);
    return res.json(result);
  } catch (e) {
    console.log(e);
    res.status(e.status).json({ errors: e.data });
  }
};

const forgotVendor = async (req, res) => {
  try {
    const result = await vendor_auth.forgotVendor(req.body);
    return res.json(result);
  } catch (e) {
    console.log(e);
    res.status(e.status).json({ error: e.data });
  }
}

//reset Vendor password
const resetPasswordVendor = async (req, res) => {
  try {
    const result = await vendor_auth.resetPasswordVendor(req.body);
    return res.json(result);
  } catch (e) {
    console.log(e);
    res.status(e.status).json({ error: e.data });
  }
}

//email verified users
const accountVerification = async (req, res) => {
  try {
    await validator.verifyAccount(req);
    const result = await vendor_auth.verifyAccount(req.body);
    return res.json(result);
  } catch (e) {
    console.log(e);
    res.status(e.status).json({ error: e.data });
  }
}

module.exports = {
  createUser,
  loginUser,
  createVendor,
  loginVendor,
  forgotVendor,
  resetPasswordVendor,
  accountVerification
};
