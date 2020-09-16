"use strict";

// Declare vendor model
module.exports = (sequelize, DataTypes) => {
  const vendor = sequelize.define(
    "Vendor",
    {
      company_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      website: DataTypes.STRING,
      business_number: DataTypes.STRING,
      verified_email: DataTypes.BOOLEAN,
      verified_token: DataTypes.STRING,
      address_line: DataTypes.TEXT,
      apartment: DataTypes.STRING,
      city: DataTypes.STRING,
      province: DataTypes.STRING,
      zip_code: DataTypes.STRING,
      country: DataTypes.STRING,
      phone: DataTypes.STRING,
      company_desciption: DataTypes.TEXT,
      shopify_collection_id: DataTypes.STRING,
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      reset_token: DataTypes.STRING,
      reset_token_expiry: DataTypes.INTEGER,
      time_zone: DataTypes.STRING,
    },
    {}
  );
  return vendor;
};
