const shopify = require("../lib/shopify");

const { error } = require("../errors");
const { generateResponse } = require("../responses");

// Update Metafields
const genericMeta = async function (request) {
  let response;
  const { customerId } = request.params;
  const { actions, key, key_data, separator = ',' } = request.body;
  try {
    if (!customerId) throw { message: 'invalid id sent man' };
    if (!key) throw { message: 'please add key name you want for metafield' };
    if (!actions && actions.length) throw { message: 'please add action method' };

    const metaFieldList = await shopify.metafield.list({
      metafield: { owner_resource: 'customers', owner_id: customerId },
    });

    for (action of actions) {
      switch (action) {
        case "remove":
          if (!metaFieldList.length) {
            response = { msg: "no metafield exist", result: {} };
            break;
          }
          for (data of metaFieldList) {
            if (data.key === key) {
              await shopify.metafield.delete(data.id);
              response = { msg: `${key} deleted successfully"`, result: {} };
            }
          }
          break;
        case "add":
          response = await shopify.metafield.create({
            key,
            value: JSON.stringify(key_data),
            value_type: "json_string",
            namespace: "customers",
            owner_resource: "customer",
            owner_id: customerId,
          });
          response = { msg: "metafields added", result: response };
          break;
        case "partial_add":
          if (!metaFieldList.length) {
            response = { msg: "no metafield found to add", result: response };
          }
          for (data of metaFieldList) {
            if (data.key === key) {
              const value = `${JSON.parse(data.value)}${separator}${key_data}`;
              response = await shopify.metafield.update(data.id, {
                key,
                value: JSON.stringify(value),
                value_type: "json_string",
                namespace: "customers",
                owner_resource: "customer",
                owner_id: customerId,
              });
              response = { msg: "metafields updated", result: response };
            }
          }
          break;
        case "partial_remove":
          for (data of metaFieldList) {
            if (data.key === key) {
              const parsedData = JSON.parse(data.value)
                .split(separator)
                .filter((val) => val !== key_data)
                .join(",");
              response = await shopify.metafield.update(data.id, {
                key,
                value: JSON.stringify(parsedData),
                value_type: "json_string",
                namespace: "customers",
                owner_resource: "customer",
                owner_id: customerId,
              });
              response = {
                msg: "metafields partially remove",
                result: response,
              };
            }
          }
          break;
        default:
          response = { msg: "please add action method", result: {} };
          break;
      }
    }
    return generateResponse({ ...response }, 200, request);
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

module.exports = {
  genericMeta
};
