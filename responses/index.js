// const cors = cors();
const generateResponse = (body, code, event) => {
  console.log('Generate Response Function');
  return {
    result: body,
    status: code,
    // headers: {
    //   'Content-Type': 'application/json',
    //   'Access-Control-Allow-Origin': '*',
    //   // ...cors.corsHeaders(event),
    // },
  };
};

module.exports = {
  generateResponse,
};