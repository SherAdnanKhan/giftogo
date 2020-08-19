const metaService = require("../services/meta.service");

const updateMetas = async (req, res) => {
  try {
    const meta = await metaService.updateMeta(req);
    return meta;
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
};

module.exports = {
  updateMetas
};
