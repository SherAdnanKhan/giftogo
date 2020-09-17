"use strict";

// Declare product model
module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define(
    "Product",
    {
      title: DataTypes.STRING,
      body_html: DataTypes.TEXT,
      vendor_id: DataTypes.STRING,
      price: DataTypes.STRING,
      inventory_quantity: DataTypes.STRING,
      images: DataTypes.TEXT,
      shopify_collection_id: DataTypes.STRING,
      shopify_product_id: DataTypes.STRING,
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {}
  );
  return product;
};
