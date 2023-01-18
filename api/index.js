const server = require("./src/app.js");
require("dotenv").config();

server.listen(process.env.PORT, () => {
  console.log("Server listening at 3001"); // eslint-disable-line no-console
});
