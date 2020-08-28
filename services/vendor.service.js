const bcrypt = require("bcryptjs");
const { Vendor } = require("../models");

const getVendorById = async (id) => {
  try {
    const vendor = await Vendor.findOne({ where: { id }, limit: 1 });
    if (!vendor) {
      return { message: "No vendor exists", response: [], status: 400 }
    }
    return { message: "Vendor exists", response: [vendor], status: 200 }
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

const updateVendorById = async (id, _vendor) => {
  const { email, password, company_name, website, address_line, apartment, city, province, zip_code, country, phone, company_desciption } = _vendor;
  try {
    console.log(_vendor);
    const vendor = await Vendor.findOne({ where: { id }, limit: 1 });
    if (!vendor) {
      return { message: "No vendor exists", response: [], status: 400 }
    }
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(password, salt);
    vendor.updateAttributes({
      company_name, website, address_line, apartment, city, province, zip_code, country, phone, email, password: hash_password
    })
    return { message: "Vendor updated", response: [vendor], status: 200 }
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

module.exports = {
  getVendorById,
  updateVendorById
};
