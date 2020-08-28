const vendorService = require("../services/vendor.service");

const getAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await vendorService.getVendorById(id);
    res.status(200).json(vendor);
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
};

const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await vendorService.updateVendorById(id, req.body);
    res.status(200).json(vendor);
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
};

module.exports = {
  getAccount,
  updateAccount
};