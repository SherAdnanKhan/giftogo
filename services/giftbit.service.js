const axios = require('axios');
const { error } = require("../errors");
const { GIFT_BIT_API_BASEURL, GIFT_BIT_API_TOKEN } = process.env;
const instance = axios.create({
  baseURL: GIFT_BIT_API_BASEURL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GIFT_BIT_API_TOKEN}` }
});

const generateCampaignOrder = async (order, brand_codes) => {
  try {
    const postData = {
      "gift_template": "VNPFTKDATSFZ",
      "contacts": [
        {
          "firstname": "Khurram",
          "lastname": "Johnson",
          "email": "khurram@giftbit.co"
        },
      ],
      "price_in_cents": 5000,
      "brand_codes": brand_codes,
      "expiry": "2020-11-01",
      "id": "111"
    }
    await instance.post('campaign', postData)
      .then(function (response) {
        //console.log(response);
        return response;

      })
      .catch(function (error) {
        console.log(error.response);
      });
  } catch (e) {
    throw new error(e.message, 500);
  }
}

const getBrand = async (brand_code) => {
  try {
    const res = await instance.get(`brands/${brand_code}`);
    if (res) {
      return true;
    }
  } catch (e) {
    console.log(e);
    return false
  }

}

module.exports = {
  generateCampaignOrder,
  getBrand
};