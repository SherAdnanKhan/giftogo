const customerService = require("../services/customer.service");
const validator = require("../validator");

const updateAccount = async (req, res) => {
  try {
    await validator.updateUser(req);
    const customer = await customerService.updateUser(req.body);
    res.status(200).json(customer);
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
};

module.exports = {
  updateAccount
};