const http = require("http");
const app = require("./app");
const { mongoConnect } = require("./services/mongo");
require("dotenv").config();
// const {
//   loadPlanetsData,
// } = require("./models/planets.model");

mongoConnect();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

// await loadPlanetsData();
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
