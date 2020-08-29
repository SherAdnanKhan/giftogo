const { check, validationResult } = require("express-validator");

const { error } = require("../errors");

const signUser = async (req) => {
  await check("email", "Email is required").isEmail().run(req);
  await check("password", "Password is required").isLength({ min: 6 }).run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new error(errors.array({ onlyFirstError: true }), 500);
  }
};

const newUser = async (req) => {
  await check("email", "Email is required").isEmail().run(req);
  await check("password", "Password must be 6 or more characters long")
    .isLength({ min: 6 })
    .run(req);
  await check("password_confirmation", "Password must be 6 or more characters long")
    .isLength({ min: 6 })
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new error(errors.array({ onlyFirstError: true }), 500);
  }
};

const newVendor = async (req) => {
  await check("company_name", "Company name is required").isLength({ max: 30 }).run(req);
  await check("email", "Email is required").isEmail().run(req);
  await check("password", "Password must be 6 or 10 characters long")
    .isLength({ min: 6, max: 10 })
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new error(errors.array({ onlyFirstError: true }), 500);
  }
};

module.exports = {
  newUser,
  signUser,
  newVendor
};
