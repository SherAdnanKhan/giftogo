const vendorService = require("../services/vendor.service");
const { tokenValidation } = require("../validator/token");

const getAccount = async (req, res) => {
  try {
    const vendor_id = await tokenValidation(req, res);
    const vendor = await vendorService.getVendorById(vendor_id);
    res.status(200).json(vendor);
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
};

const updateAccount = async (req, res) => {
  try {
    const vendor_id = await tokenValidation(req, res);
    const vendor = await vendorService.updateVendorById(vendor_id, req.body);
    res.status(200).json(vendor);
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
};

const updateLogo = async (req, res) => {
  try {
    const vendor_id = await tokenValidation(req, res);
    const vendor = await vendorService.updateLogo(vendor_id, req.body);
    res.status(200).json(vendor);
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
}
const getProducts = async (req, res) => {
  const vendor_id = await tokenValidation(req, res);
  try {
    const products = await vendorService.getMyProducts(vendor_id, req.body);
    res.status(200).json(products);
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }

}

module.exports = {
  getAccount,
  updateAccount,
  updateLogo,
  getProducts
};