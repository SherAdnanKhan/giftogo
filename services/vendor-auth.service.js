const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var crypto = require('crypto');

const { APP_SECRET } = process.env;

const shopify = require("../lib/shopify");

const { Vendor } = require("../models");

const { error } = require("../errors");
const smtp=require('./email.service');
const { realpathSync } = require("fs");

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
  const token = jwt.sign(payload, APP_SECRET);
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

      const textbody="<html><head><style>.button{background-color: #008CBA;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;}.im {color: black;}</style></head>"
      +"<body><h1>Giftogo</h1><h1>Welcome to Giftogo!</h1><p>You have activated your business account. Next time to login.</p><a class="+"button button2"+" href="+"https://giftogo.co/pages/business-login"+">Visit your store</a></body></html>"

      let emailinfo= await smtp.sendemail(textbody,email,"Giftogo Business account registration");

      console.log(emailinfo);

      return { message: "Vendor created ", response: _vendor, status: 200 };
    }
    console.log("shopify createdVendorCollection", shopifyCollection);
    //   console.log("shopify createdCustomer Id", shopifyCustomer.id);
    return { message: "Vendor could not be created", response: _vendor, status: 400 };

  } catch (e) {
    console.log(e);
    throw new error(e.message, 405);
  }
};

const forgotVendor= async (data)=>{
    const {email}=data;
    let vendor = await Vendor.findOne({ where: { email }, limit: 1 });
    if (!vendor) {
      return { message: "Invalid Email", response: [], status: 400 }
    }

    // var token = new Token({ _userId: result._id, token: crypto.randomBytes(16).toString('hex') });
    // console.log(vendor,crypto.randomBytes(16).toString('hex'));

    cryptotoken=crypto.randomBytes(16).toString('hex');

    const newvendor=await Vendor.update(
      { reset_token:cryptotoken},
      { where: {id: vendor.id } }
    )

    console.log(newvendor);

    const htmlbody="<html><head><style>.button{background-color: #008CBA;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;}.im{color: black;}a{text-decoration:none;color:#008CBA}</style></head><body><h1>Giftogo</h1><h1>Reset your password</h1><p>Follow this link to reset your Partner account password at <a href="+"https://giftogo.co/"+">Giftogo</a>. If you didn't request a new password, you can safely delete this email.</p><a class="+"button button2"+" href="+">Reset your password</a> or <a href="+"https://giftogo.co/pages/business-login"+">Visit your store</a></body></html>";
    
    let emailinfo= await smtp.sendemail(htmlbody,email,"Giftogo Reset Password");

    console.log(emailinfo);
    

    return {message:"Email sent please check your email.", token:cryptotoken}
    
}

const resetPasswordVendor= async (data)=>{
  
  const {email,password,token}=data;

  let vendor = await Vendor.findOne({ where: { email }, limit: 1 });
  if (!vendor) {
    return { message: "Invalid Email", response: [], status: 400 }
  }

  console.log(vendor);
  var newvendor;
  if(vendor.reset_token===token){
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(password, salt);
    newvendor=await Vendor.update(
      { reset_token:"",
        password: hash_password,
      },
      { where: {id: vendor.id } }
    )
  }
  else{
    return {message: "Token expired", response: [], status: 400}
  }

  return {message:"Password Reset Success",response: newvendor, status: 200}
  
}

module.exports = {
  createVendor,
  loginVendor,
  forgotVendor,
  resetPasswordVendor
  
};
