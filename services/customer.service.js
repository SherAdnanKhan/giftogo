const shopify = require("../lib/shopify");
// create new user service
const updateUser = async (_user) => {
  const { customer_id, first_name, last_name, password, dob, gender } = _user;
  try {
    const check_customer_already = await shopify.customer.get(customer_id);
    if (!check_customer_already) {
      return { message: "Invalid Customer", response: [], status: 400 }
    }


    //update metafields
    const metaFieldList = await shopify.metafield.list({
      metafield: { owner_resource: 'customers', owner_id: customer_id },
    });

    if (dob) {
      for (data of metaFieldList) {
        if (data.key === 'dob') {
          await shopify.metafield.update(data.id, {
            key: 'dob',
            value: dob,
            value_type: "string",
            namespace: "customers",
            owner_resource: "customer",
            owner_id: customer_id,
          });
        }
      }
    }
    if (gender) {
      for (data of metaFieldList) {
        if (data.key === 'gender') {
          await shopify.metafield.update(data.id, {
            key: 'gender',
            value: gender,
            value_type: "string",
            namespace: "customers",
            owner_resource: "customer",
            owner_id: customer_id,
          });
        }
      }
    }

    if (!password) {
      var updateUser = {
        first_name,
        last_name,
      }
    }
    else {
      var updateUser = {
        id: customer_id,
        first_name,
        last_name,
        password,
        password_confirmation: password,
      }
    }

    await shopify.customer.update(customer_id, updateUser);
    const shopifyCustomer = await shopify.customer.get(customer_id);
    console.log("customer Update", shopifyCustomer);
    return { message: "Customer Updated", response: shopifyCustomer, status: 200 };
  } catch (e) {
    console.log(e);
    return { message: "Customer not found", response: [], status: 400 }
  }

};

module.exports = {
  updateUser,
};