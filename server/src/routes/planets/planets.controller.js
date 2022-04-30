const { planets } = require("../../models/planets.model");

function getPlanets(req, res) {
  res
    .status(200)
    .json(
      planets.filter((planet) => planet.kepler_name !== "")
    );
}

module.exports = {
  getPlanets,
};
