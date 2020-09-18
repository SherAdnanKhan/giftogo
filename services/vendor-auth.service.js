const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var crypto = require('crypto');

const { APP_SECRET } = process.env;

const shopify = require("../lib/shopify");

const { Vendor } = require("../models");

const { error } = require("../errors");
const smtp = require('./email.service');

//email content of account verified 

const emailVerificationContent = (company_name, email, token) => {
  const textbody = `<html>
                      <head>
                        <style>
                          .button{
                            background-color: #008CBA;
                            border: none;
                            color: white;
                            padding: 15px 32px;
                            text-align: center;
                            text-decoration: none;
                            display: inline-block;
                            font-size: 16px;
                            margin: 4px 2px;
                            cursor: pointer;
                          }
                          .im {
                            color: black;
                          }
                          .center {
                            text-align: center;
                          }
                        </style>
                      </head>
                      <body>
                        <h1>Hi ${company_name}</h1>
                        <p>Welcome to Giftogo!</p>
                        <p>You have successfully created your Giftogo account!</p>
                        <p>You’re one click away from being able to tap into our smartest gifting platform and start sharing every moment with your friends and family. </p>
                        <p>Confirm your email address and activate your account by following this link: </p>
                        <p><a href="https://giftogo.co/pages/business-login/?email=${email}&activation_code=${token}">https://giftogo.co/pages/business-login/?email=${email}&activation_code=${token}</a></p>
                        <p class="center"><a class="button" href="https://giftogo.co/pages/business-login/?email=${email}&activation_code=${token}">Activate Account</a></p>
                        <p>If you have any questions, feel free to browse through our Contact Us, or contact us at support@giftogo.co</p>
                        <p>Thank you,</p>
                        <p>Giftogo Support</p>
                      </body>
                    </html>`;
  return textbody;
}

// login user service
const loginVendor = async (_vendor) => {
  const cryptotoken = crypto.randomBytes(16).toString('hex');
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

  if (!vendor.verified_token) {
    const emailContent = emailVerificationContent(vendor.company_name, vendor.email, cryptotoken);
    let emailinfo = await smtp.sendemail(emailContent, email, "Giftogo Business account Verification");
    console.log(emailinfo);

    await Vendor.update(
      {
        verified_email: cryptotoken,
        verified_token: false,
      },
      { where: { id: vendor.id } }
    );

    return { message: "Account is unverified. Verify your account by checking email ", response: [], status: 400 };
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
  const cryptotoken = crypto.randomBytes(16).toString('hex');
  const { email, password, company_name, website, address_line, apartment, city, province, zip_code, country, phone, business_number } = _vendor;
  try {
    let vendor = await Vendor.findAll({ where: { email }, limit: 1 });
    let company_check = await Vendor.findOne({ where: { company_name } });
    let website_check = await Vendor.findOne({ where: { website } });
    if (vendor.length) {
      // throw new error("Vendor Already exists", 400);
      return { message: "Email already exists", response: [], status: 400 };
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
        business_number,
        verified_email: cryptotoken,
        verified_token: false,
        address_line,
        apartment,
        city,
        province,
        zip_code,
        country,
        phone,
        shopify_collection_id: shopifyCollection.id
      });

      const emailContent = emailVerificationContent(company_name, email, cryptotoken);
      let emailinfo = await smtp.sendemail(emailContent, email, "Giftogo Business account registration");

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

const forgotVendor = async (data) => {
  const { email } = data;
  let vendor = await Vendor.findOne({ where: { email }, limit: 1 });
  if (!vendor) {
    return { message: "Invalid Email", response: [], status: 400 }
  }

  // var token = new Token({ _userId: result._id, token: crypto.randomBytes(16).toString('hex') });
  // console.log(vendor,crypto.randomBytes(16).toString('hex'));
  try {
    cryptotoken = crypto.randomBytes(16).toString('hex');

    const newvendor = await Vendor.update(
      { reset_token: cryptotoken },
      { where: { id: vendor.id } }
    )

    const htmlbody = `<html>
                        <head>
                          <style>
                            .button{
                              background-color: #008CBA;
                              border: none;color: white;
                              padding: 15px 32px;
                              text-align: center;
                              text-decoration: none;
                              display: inline-block;
                              font-size: 16px;
                              margin: 4px 2px;
                              cursor: pointer;
                            }
                            .im{
                              color: black;
                            }
                            a{
                              text-decoration:none;
                              color:#008CBA
                            }
                          </style>
                        </head>
                        <body>
                          <h1>Giftogo</h1>
                          <h1>Reset your password</h1>
                          <p>Follow this link to reset your Partner account password at 
                            <a href="https://giftogo.co/">Giftogo</a>.
                            If you didn't request a new password, you can safely delete this email.
                          </p>
                          <a class="button" href="https://giftogo.co/pages/business-reset-password/?email=${email}&token=${cryptotoken}">Reset your password</a>
                            or 
                          <a href="https://giftogo.co/pages/business-login">Visit your store</a>
                        </body>
                      </html>`;
    await smtp.sendemail(htmlbody, email, "Giftogo Reset Password");
  } catch (e) {
    console.log(e);
    return { message: "Email Could not be sent this time.", response: [], status: 400 }
  }

  return { message: "Email sent please check your email.", token: cryptotoken, status: 200 }
}

const resetPasswordVendor = async (data) => {

  const { email, password, token } = data;

  let vendor = await Vendor.findOne({ where: { email }, limit: 1 });
  if (!vendor) {
    return { message: "Invalid Email", response: [], status: 400 }
  }

  var newvendor;
  if (vendor.reset_token === token) {
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(password, salt);
    newvendor = await Vendor.update(
      {
        reset_token: "",
        password: hash_password,
      },
      { where: { id: vendor.id } }
    )
  }
  else {
    return { message: "Token expired", response: [], status: 400 }
  }

  return { message: "Password Reset Success", response: newvendor, status: 200 }

}

const verifyAccount = async (data) => {
  const { email, token } = data;

  let vendor = await Vendor.findOne({ where: { email }, limit: 1 });
  if (!vendor) {
    return { message: "Invalid Email", response: [], status: 400 }
  }

  if (vendor.verified_token) {
    return { message: "Account is already verified and Token is expired", response: [], status: 400 }
  }

  if (vendor.verified_email == token) {
    await Vendor.update(
      {
        verified_token: true,
        verified_email: '',
      },
      { where: { id: vendor.id } }
    );
  }
  else {
    return { message: "Token expired or invalid", response: [], status: 400 }
  }
  return { message: "Account Verified", response: [], status: 200 }
}

module.exports = {
  createVendor,
  loginVendor,
  forgotVendor,
  resetPasswordVendor,
  verifyAccount
};
