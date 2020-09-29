const shopify = require("../lib/shopify");
const { error } = require("../errors");
const axios = require('axios');
const rp = require('request-promise');
const cheerio = require('cheerio');


const instanceTango = axios.create({
  baseURL: "https://integration-api.tangocard.com/raas/v2",
  timeout: 5000,
  headers: { 'Content-Type': 'application/json', 'Authorization': `Basic R2lmdG9nb1Rlc3Q6YlNjR29LQElOa3VuZlNaUHRAJm5CZGR2QUlMdGRieENGWkB1RHV4U0x2Ukg=` }
});

const getOrderById = async (orderId) => {
  try {
    const order = await shopify.order.get(orderId);
    return order;
  } catch (e) {
    console.log(e);
    throw new error(e.message, 500);
  }
};

const orderMaskingTangService = async (orderId, customerId) => {

  try {
    const order = await shopify.order.get(orderId);
    const customer = await shopify.customer.get(customerId);
    let redemption_url = '';

    //if financial_status = paid then proceed
    if (order.financial_status == "paid") {
      // for dominos=U012700 for starbucks=U761382
      const data = {
        "accountIdentifier": "A01065868",
        "amount": order.total_price,
        "campaign": "giftogo test campaign",
        "customerIdentifier": "G50214556",
        "externalRefID": orderId,
        "recipient": {
          "email": "sarahsajjad93@gmail.com",
          "firstName": "Sarah",
          "lastName": "Sajjad"
        },
        "referenceOrderID": orderId,
        "rewardName": "test reward",
        "sendEmail": false,
        "status": "true",
        "utid": "U012700"
      }

      await instanceTango.post('/orders', data)
        .then(function async(response) {
          console.log("Response", response);
          console.log("Credentials", response.data.reward.credentials);
          console.log("Credential List", response.data.reward.credentialList[0].value);
          redemption_url = response.data.reward.credentialList[0].value;
        })
        .catch(function (error) {
          console.log(error);
        });


      if (redemption_url != '') {
        const redemptionServices = await rp(redemption_url)
          .then(function (html) {
            //success!
            var $ = cheerio.load(html);

            let redemptionnumbersdiv = $('td[class="redemptionnumber"]').html();
            let bar_image_url = $('td[class="kohlsimage"] div img').attr('src');
            console.log(bar_image_url);
            const numbers_valid = redemptionnumbersdiv.match(/\d+/g);
            console.log(numbers_valid);

            const card_number = numbers_valid[0];
            const card_pin = numbers_valid[2];
            return { bar_image_url, card_number, card_pin };
          })
          .catch(function (err) {
            //handle error
            //console.log(err);
            return {
              bar_image_url: null,
              card_number: null,
              card_pin: null
            }
          });

        return {
          message: "Tango services offered",
          response: {
            redemptionServices
          },
          status: 200
        }
      } else {
        return {
          message: "Tango services no url",
          response: {
            redemptionServices: {
              bar_image_url: null,
              card_number: null,
              card_pin: null
            }
          },
          status: 402
        }
      }


    }
    else {
      return {
        message: "Tango services Rejected",
        response: {
          order,
          customer
        },
        status: 400
      }
    }


  }
  catch (ex) {
    console.log(ex);
    return { message: "Unable to masking at this time", response: [], status: 400 }
  }
}


module.exports = {
  getOrderById,
  orderMaskingTangService
};
