"use strict";

// Declare user model
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "User",
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      permissions: {
        type: DataTypes.ENUM("USER", "ADMIN"),
        defaultValue: "USER",
      },
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
  return user;
};
