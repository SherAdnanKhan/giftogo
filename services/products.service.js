const shopify = require("../lib/shopify");
const paginate = require("../util/paginate.util");
const { Vendor } = require("../models");
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
  const { limit = 10, page = 1 } = params;
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
    console.log(description);
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
          sku: "123",
          inventory_management: "shopify",
          inventory_quantity: inventory
        },
        
      ]
    }

    console.log(product_data);
    const product = await shopify.product.create(product_data);
    const variant = product.variants[0];
    console.log(variant)
    //add collection 
    const collect = await shopify.collect.create({
      product_id: product.id,
      collection_id: parseInt(collection_id)
    })
    //update price
    const _variant = await shopify.productVariant.update(variant.id, {
      price,
    });
    //update inventory
    //const _inventory = await shopify.inventoryLevel.list(_variant.inventory_item_id)
    //console.log(_inventory);

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
