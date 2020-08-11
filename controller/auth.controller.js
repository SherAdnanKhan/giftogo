const validator = require("../validator");

const auth = require("../services/auth.service");

const error = require("../errors");

// create users
const createUser = async (req, res) => {
  try {
    await validator.newUser(req);
    const result = await auth.createUser(req.body);
    return res.json(result);
  } catch (e) {
    console.log(e);
    res.status(e.status).json({errors: e.data});
  }
};

module.exports = {
  createUser,
};
