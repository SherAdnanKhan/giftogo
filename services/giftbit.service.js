const axios = require('axios');
const { error } = require("../errors");
const { GIFT_BIT_API_BASEURL, GIFT_BIT_API_TOKEN } = process.env;
const instance = axios.create({
  baseURL: GIFT_BIT_API_BASEURL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GIFT_BIT_API_TOKEN}` }
});

const generateCampaignOrder = async (order, brand_code) => {
  try {
    const postData = {
      "price_in_cents": 2500,
      "brand_code": brand_code,
      "id": "121"
    }
    await instance.post('embedded', postData)
      .then(function (response) {
        console.log(response);
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