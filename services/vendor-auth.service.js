const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { APP_SECRET } = process.env;

const shopify = require("../lib/shopify");

const { Vendor } = require("../models");
const { error } = require("../errors");

// login user service
const loginVendor = async (_vendor) => {
  const { email, password } = _vendor;
  //  Check if user exists
  let vendor = await Vendor.findOne({ where: { email }, limit: 1 });
  if (!vendor) {
    return { message: "Invalid Email", response: [], status: 400 }
  }
  const isMatch = await bcrypt.compare(password, vendor.dataValues.password);
  if (!isMatch) {
    return { message: "Invalid Credentials", response: [], status: 400 };
  }
  const collectionId = vendor.shopify_collection_id;
  const shopifyCollection = await shopify.customCollection.get(collectionId);

  //  Send jsonwebtoken
  const payload = {
    vendor: {
      id: vendor.dataValues.id,
    },
  };
  const token = jwt.sign(payload, APP_SECRET, { expiresIn: 36000 });
  return { message: "Vendor login", response: { token, vendor: vendor, collection: shopifyCollection }, status: 200 };
};

// create new user service
const createVendor = async (_vendor) => {
  const { email, password, company_name, website, address_line, apartment, city, province, zip_code, country, phone } = _vendor;
  try {
    let vendor = await Vendor.findAll({ where: { email }, limit: 1 });
    let company_check = await Vendor.findOne({ where: { company_name } });
    let website_check = await Vendor.findOne({ where: { website } });
    if (vendor.length) {
      // throw new error("Vendor Already exists", 400);
      return { message: "Partner name already exists", response: [], status: 400 };
    }
    if (company_check) {
      // throw new error("Vendor Already exists", 400);
      return { message: "Company name is already exists", response: [], status: 400 };
    }
    if (website_check) {
      // throw new error("Vendor Already exists", 400);
      return { message: "Website is already exists", response: [], status: 400 };
    }
    const shopifyCollection = await shopify.customCollection.create({ 'title': company_name });
    if (shopifyCollection && shopifyCollection.id) {
      const salt = await bcrypt.genSalt(10);
      const hash_password = await bcrypt.hash(password, salt);
      const vendor = Vendor.create({
        email,
        password: hash_password,
        company_name,
        website,
        address_line,
        apartment,
        city,
        province,
        zip_code,
        country,
        phone,
        shopify_collection_id: shopifyCollection.id
      });
      return { message: "Vendor created", response: _vendor, status: 200 };
    }
    console.log("shopify createdVendorCollection", shopifyCollection);
    //   console.log("shopify createdCustomer Id", shopifyCustomer.id);
    return { message: "Vendor could not be created", response: _vendor, status: 400 };

  } catch (e) {
    console.log(e);
    throw new error(e.message, 405);
  }
};

module.exports = {
  createVendor,
  loginVendor,
};
