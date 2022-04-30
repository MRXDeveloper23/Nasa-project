const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");

const results = [];

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11
  );
};
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (chunk) => {
        if (isHabitablePlanet(chunk)) {
          results.push(chunk);
        }
      })
      .on("error", (err) => reject(err))
      .on("end", () => resolve());
  });
}

module.exports = {
  loadPlanetsData,
  planets: results,
};
