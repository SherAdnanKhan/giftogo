const { check, validationResult } = require("express-validator");

const { error } = require("../errors");

const newUser = async (req) => {
  await check("email", "Email is required").isEmail().run(req);
  await check("password", "Password must be 6 or more characters long")
    .isLength({ min: 6 })
    .run(req);
  await check("password2", "Password must be 6 or more characters long")
    .isLength({ min: 6 })
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new error(errors.array({ onlyFirstError: true }), 500);
  }
};

module.exports = {
  newUser,
};
