const getAccount = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    //const product = await productService.getProductById(id);
    res.status(200).json();
  } catch (e) {
    console.log(e.message);
    res.status(e.status).json({ errors: e.data });
  }
};

module.exports = {
  getAccount
};