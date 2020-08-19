const shopify = require("../lib/shopify");

const { error } = require("../errors");
const { generateResponse } = require("../responses");

// Update Metafields
const updateMeta = async function (request) {
  console.log('Update Metafields Function');
  const { customerId } = request.params;
  const body = request.body;
  try {
    if (!customerId) throw { message: 'invalid id sent man' };
    if (!body.key) throw { message: 'please add key name you want for metafield' };
    if (!body.action) throw { message: 'please add action method' };

    const metafield_list = await shopify.metafield.list();
    if (metafield_list.length) {
      const customer = await shopify.metafield.list({
        metafield: { owner_resource: 'customer', owner_id: customerId },
      });
    }
    shopify.on('callLimits', (limits) => console.log(limits));
    // switch (body.action) {
    //   case 'create':
    //     console.log('create new action');
    //     break;
    //   case 'delete':
    //     console.log('delete action');
    //     break;
    //   case 'update':
    //     console.log('update action');
    //     break;
    //   default:
    //     throw { message: 'please add valid action method' };
    // }
    // if (customer.length) {
    //   await shopify.metafield.delete(customer[0].id);
    //   console.log('hey ! there was already a metafield.');
    // }
    const result = await shopify.metafield.create({
      metafield: {
        key: "test",
        value: "gfdgfdg",
        value_type: 'string',
        namespace: 'customer',
        owner_resource: 'customer',
        owner_id: 3204322820130,
      }
    });
    return generateResponse([], 200, request);
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

module.exports = {
  updateMeta
};
