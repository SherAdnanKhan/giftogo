const { check, validationResult } = require("express-validator");
const { error } = require("../errors");



const AddProductValidation = async (req) => {
  await check("title", "Title is required").exists().run(req);
  await check("description", "Description is required").exists().run(req);
  await check("product_type", "Product Type is required").exists().run(req);
  await check("price", "Price is required").exists().run(req);
  await check("inventory", "Inventory is required").exists().run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new error(errors.array({ onlyFirstError: true }), 500);
  }
};
module.exports = {
  AddProductValidation
};