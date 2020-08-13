module.exports = (array, limit, page_number) => {
  return array.slice((page_number - 1) * limit, page_number * limit);
};
