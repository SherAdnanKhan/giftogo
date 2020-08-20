const metaService = require("../services/meta.service");

const updateMetas = async (req, res) => {
  try {
    console.log(req.body);
    const meta = await metaService.genericMeta(req);
    res.status(200).send(meta);
    //return meta;
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
};

module.exports = {
  updateMetas
};
