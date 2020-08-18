"use strict";

// Declare api_services model
module.exports = (sequelize, DataTypes) => {
  const api_service = sequelize.define(
    "ApiServices",
    {
      service_name: DataTypes.STRING,
      url: DataTypes.STRING,
      token_type: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true
      },
      token: {
        type: DataTypes.TEXT,
        defaultValue: null,
        allowNull: true
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {}
  );
  return api_service;
};
