const express = require("express");
const app = express();
const port = parseInt(process.env.PORT, 10) || 8080;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
