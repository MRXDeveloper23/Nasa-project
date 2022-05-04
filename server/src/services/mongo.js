const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://developer:developer23@cluster0.pdevd.mongodb.net/nasaProject?retryWrites=true&w=majority";
mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

function mongoConnect() {
  mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
async function mongoDisconnect() {
  mongoose.connection.close(function () {
    console.log("Mongoose connection disconnected");
  });
  await mongoose.disconnect();
}
module.exports = {
  mongoDisconnect,
  mongoConnect,
};
