const {
  getAllPlanets,
} = require("../../models/planets.model");

async function httpGetPlanets(req, res) {
  res.status(200).json(await getAllPlanets());
}

module.exports = {
  httpGetPlanets,
};
