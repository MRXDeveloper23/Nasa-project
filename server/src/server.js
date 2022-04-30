const http = require("http");
const app = require("./app");
require("dotenv").config();
const {
  loadPlanetsData,
} = require("./models/planets.model");

const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

(async function () {
  await loadPlanetsData();
})();
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
