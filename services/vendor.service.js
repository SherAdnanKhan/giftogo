const bcrypt = require("bcryptjs");
const { Vendor } = require("../models");
const shopify = require("../lib/shopify");


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
    const vendor = await Vendor.findOne({ where: { id }, limit: 1 });
    if (!vendor) {
      return { message: "No vendor exists", response: [], status: 400 }
    }
    if (password === vendor.password) {
      hash_password = password;
    }
    else {
      const salt = await bcrypt.genSalt(10);
      hash_password = await bcrypt.hash(password, salt);
    }

    await Vendor.update({
      website, address_line, apartment, city, province, zip_code, country, phone, password: hash_password
    }, { where: { id } });

    const updated_vendor = await Vendor.findOne({ where: { id }, limit: 1 });
    return { message: "Vendor updated", response: [updated_vendor], status: 200 }
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

const updateLogo = async (id, logo) => {
  const vendor = await Vendor.findOne({ where: { id }, limit: 1 });
  if (!vendor) {
    return { message: "No vendor exists", response: [], status: 400 }
  }
  const collectionId = vendor.shopify_collection_id;
  try {
    const shopifyCollection = await shopify.customCollection.update(collectionId, logo);
    return { message: "Vendor logo updated", response: shopifyCollection, status: 200 }
  } catch (e) {
    console.log(e);
    return { message: "Vendor could not be updated", response: [], status: 400 }
  }

}

module.exports = {
  getVendorById,
  updateVendorById,
  updateLogo
};
