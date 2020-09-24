var url = require('url');
const bcrypt = require("bcryptjs");
const { Vendor } = require("../models");
const shopify = require("../lib/shopify");
const paginate = require("../util/paginate.util");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getVendorById = async (id) => {
  try {
    const vendor = await Vendor.findOne({ where: { id }, limit: 1 });
    if (!vendor) {
      return { message: "No vendor exists", response: [], status: 400 }
    }
    const collectionId = vendor.shopify_collection_id;
    const shopifyCollection = await shopify.customCollection.get(collectionId);
    data = {
      vendor,
      collection: shopifyCollection
    }
    return { message: "Vendor exists", response: [data], status: 200 }
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

const updateVendorById = async (id, _vendor) => {
  const { password, website, address_line, apartment, city, province, zip_code, country, phone, company_desciption, business_number } = _vendor;
  try {
    const vendor = await Vendor.findOne({ where: { id }, limit: 1 });
    var web = website.toString();
    console.log(web);
    console.log(url.parse(web.toString()).hostname);
    let website_check = await Vendor.findOne({ where: { website } });
    if (!vendor) {
      return { message: "No vendor exists", response: [], status: 400 }
    }

    // console.log(website_check.id!==id);
    if (website_check) {
      if (website_check.id !== id) {
        return { message: "Website is already exists", response: [], status: 400 };
      }
    }
    const collectionId = vendor.shopify_collection_id;
    if (password.length == 0) {
      hash_password = vendor.password;
    }
    else {
      const salt = await bcrypt.genSalt(10);
      hash_password = await bcrypt.hash(password, salt);
    }

    await Vendor.update({
      website, address_line, apartment, city, province, zip_code, country, phone, password: hash_password, company_desciption, business_number
    }, { where: { id } });

    const collection = await shopify.customCollection.update(collectionId, {
      "body_html": company_desciption
    });

    const updated_vendor = await Vendor.findOne({ where: { id }, limit: 1 });
    return { message: "Vendor updated", response: { vendor: updated_vendor, collection }, status: 200 }
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

const updateLogo = async (id, logo) => {
  const vendor = await Vendor.findOne({ where: { id }, limit: 1 });
  if (!vendor) {
    return { message: "No vendor exists", response: [], status: 400 }
  }
  const collectionId = vendor.shopify_collection_id;
  try {
    const shopifyCollection = await shopify.customCollection.update(collectionId, logo);
    return { message: "Vendor logo updated", response: shopifyCollection, status: 200 }
  } catch (e) {
    console.log(e);
    return { message: "Vendor could not be updated", response: [], status: 400 }
  }

}

const getMyProducts = async (id, params) => {
  const vendor = await Vendor.findOne({ where: { id } });
  if (!vendor) {
    return { message: "No vendor exists", response: [], status: 400 }
  }
  const collection_id = vendor.shopify_collection_id;
  //const collection_id = 175982575650;
  const { limit = 10, page = 1, order } = params;
  let listParams = { limit, collection_id, order }, productList = [];
  try {
    const count_products = await shopify.product.list({ collection_id });
    const count = count_products.length;
    const pages = Math.ceil(count / limit);
    do {
      const shopifyProducts = await shopify.product.list(listParams);
      productList = [...productList, ...shopifyProducts];
      listParams = shopifyProducts.nextPageParameters;
    } while (listParams !== undefined);
    const products = paginate(productList, limit, page);
    return {
      message: "Vendor Posts", response: { count, pages, products }, status: 200
    }
  } catch (e) {
    console.log(e);
    return { message: "Vendor could not get Prducts! please reload", response: [], status: 400 }
  }
}

const getMyPayouts = async (id, params) => {
  const vendor = await Vendor.findOne({ where: { id } });
  let product_ids = [], order_payouts = [];
  if (!vendor) {
    return { message: "No vendor exists", response: [], status: 400 }
  }
  const collection_id = vendor.shopify_collection_id;
  //const collection_id = 177747296290;
  try {
    const productList = await shopify.product.list({ collection_id });
    for (product of productList) {
      product_ids.push(product.id);
    }

    const orders = await shopify.order.list();
    for (order of orders) {
      for (line_item of order.line_items) {
        if (product_ids.indexOf(line_item.product_id) !== -1) {
          let sales = parseFloat(line_item.price) - parseFloat(line_item.total_discount);
          order_payouts.push({
            "payout_date": order.processed_at,
            "status": order.financial_status,
            "fulfillments": order.fulfillments,
            "cancelled_at": order.cancelled_at,
            "cancel_reason": order.cancel_reason,
            'sales': sales,
            'refund': null,
            'price': line_item.price,
            'discount': line_item.total_discount,
            'balance': sales
          });
        }
      }
    }
    console.log(order_payouts);
    const { limit = 10, page = 1 } = params;
    var newdata;
    if (!page || page == 1) {
      const start = 0;
      const end = limit * 1;
      newdata = order_payouts.slice(start, end);
      console.log("newdata", newdata);
    }
    else {
      const start = limit * (page - 1);
      const end = limit * page;
      newdata = order_payouts.slice(start, end);
      console.log("newdata", newdata);
    }

    return {
      message: "Vendor Posts", response: { order_payouts: newdata }, status: 200
    }
  } catch (e) {
    console.log(e);
    return { message: "Vendor could not get Prducts! please reload", response: [], status: 400 }
  }

}

const searchCollections = async (search) => {
  var _vendors_with_products = [];

  try {
    const vendors = await Vendor.findAll({ where: { company_name: { [Op.like]: `%${search}%` } } });
    for (vendor of vendors) {
      let listParams = { collection_id: vendor.shopify_collection_id };
      const shopifyVendorProducts = await shopify.product.list(listParams);
      if (shopifyVendorProducts.length != 0) {
        const shopifyCollection = await shopify.customCollection.get(vendor.shopify_collection_id);
        let data = {
          vendor,
          shopifyCollection,
          products: shopifyVendorProducts
        };
        _vendors_with_products.push(data);
      }
    }
    return {
      message: "Search Collection Posts", response: { vendors: _vendors_with_products }, status: 200
    }
  } catch (e) {
    console.log(e);
    return { message: "Unable to search please try later!", response: [], status: 400 }
  }
}

module.exports = {
  getVendorById,
  updateVendorById,
  updateLogo,
  getMyProducts,
  getMyPayouts,
  searchCollections
};
