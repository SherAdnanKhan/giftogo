const shopify = require("../lib/shopify");
const paginate = require("../util/paginate.util");
const { Vendor, Product } = require("../models");
const { error } = require("../errors");

// get product by product id
const getProductById = async (productId) => {
  try {
    const product = await shopify.product.get(productId);
    return product;
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

// fetch products list
const productsList = async (params) => {
  console.log(params);
  const { limit, page } = params;
  let listParams = { limit: 250 },
    productList = [];
  try {
    const count = await shopify.product.count();
    do {
      const shopifyProducts = await shopify.product.list(listParams);
      productList = [...productList, ...shopifyProducts];
      listParams = shopifyProducts.nextPageParameters;
    } while (listParams !== undefined);
    const products = paginate(productList, limit, page);
    return { count, products };
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

const getProductMetas = async (productId) => {
  try {
    const metaFieldList = await shopify.metafield.list({
      metafield: { owner_resource: 'products', owner_id: productId },
    });
    return metaFieldList;
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
}
const addProduct = async (_vendor_id, _product) => {
  const { title, description, vendor, product_type, price, inventory, images } = _product;

  try {
    let vendor_check = await Vendor.findOne({ where: { id: _vendor_id }, limit: 1 });
    if (!vendor_check) {
      return { message: "Account is deleted by Shopify", response: [], status: 400 };
    }
    const collection_id = vendor_check.shopify_collection_id;
    const collection = await shopify.customCollection.get(collection_id);
    if (!collection) {
      return { message: "Account is deleted by Shopify", response: [], status: 400 };
    }
    let skuid = Date.parse(new Date());
    console.log(skuid);
    const product_data = {
      title,
      body_html: description,
      //collection_id: parseInt(collection_id),
      product_type,
      tags: vendor_check.company_name.toLowerCase(),
      vendor,
      images,
      variants: [
        {
          price: price,
          sku: skuid,
          inventory_management: "shopify",
          inventory_quantity: inventory,
          requires_shipping: false
        },

      ]
    }

    const product = await shopify.product.create(product_data);

    //add collection 
    const collect = await shopify.collect.create({
      product_id: product.id,
      collection_id: parseInt(collection_id)
    })

    //add to our database
    const _product = Product.create({
      title,
      body_html: description,
      vendor_id: _vendor_id,
      price,
      inventory_quantity: inventory,
      images: "",
      shopify_product_id: product.id,
      shopify_collection_id: collection_id
    });

    const product_detail = await shopify.product.get(product.id);
    return {
      message: "Vendor Posts", response: product_detail, status: 200
    }

  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
}

module.exports = {
  getProductById,
  productsList,
  getProductMetas,
  addProduct
};
