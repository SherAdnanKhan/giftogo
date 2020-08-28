const orderService = require("../services/orders.service");
const productsService = require("../services/products.service");
const giftbitService = require("../services/giftbit.service");

const masking = async (req, res) => {
  try {
    const { id } = req.params;
    let barcodes = [];
    let brand_code = null;
    const order = await orderService.getOrderById(id);
    const line_items = order.line_items;
    for (line_item of line_items) {
      let metafields = await productsService.getProductMetas(line_item.product_id);
      for (metafield of metafields) {
        console.log(metafield);
        if (metafield.key === 'brand_code') {
          //if brand code exsits in giftbit
          const have_brand = await giftbitService.getBrand(metafield.value);
          if (have_brand) {
            barcodes.push(metafield.value);
            brand_code = metafield.value;
          }
          console.log(barcodes);
        }
      }
    }

    const campaign = await giftbitService.generateCampaignOrder(order, brand_code);
    if (campaign) {
      console.log(campaign);
    }
    res.status(200).json(order);
    // Promise.all(promises).then(getcode => {
    //   
    //   
    // })

  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
};

module.exports = {
  masking,
};
