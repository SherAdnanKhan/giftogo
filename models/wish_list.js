"use strict";

// Declare api_services model
module.exports = (sequelize, DataTypes) => {
  const wish_list = sequelize.define(
    "WishList",
    {
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
    },
    {}
  );
  return wish_list;
};
