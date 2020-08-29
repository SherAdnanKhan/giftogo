const jwt = require("jsonwebtoken");
const { APP_SECRET } = process.env;

const tokenValidation = async (req, res) => {
  let token = req.headers['x-access-token'];
  let vendor_id;
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, APP_SECRET, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    //console.log(decoded.vendor.id);
    vendor_id = decoded.vendor.id;
  });
  return vendor_id;
};

module.exports = {
  tokenValidation
};