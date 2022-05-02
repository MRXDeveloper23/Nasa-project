const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
const {
  loadPlanetsData,
} = require("./models/planets.model");
const MONGO_URL =
  "mongodb+srv://developer:developer23@cluster0.pdevd.mongodb.net/nasaProject?retryWrites=true&w=majority";

const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}
startServer();
