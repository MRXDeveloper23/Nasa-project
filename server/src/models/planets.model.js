const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const planets = require("./planets.mongo");

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
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanet(data);
        }
      })
      .on("error", (err) => reject(err))
      .on("end", () => resolve());
  });
}

async function getAllPlanets() {
  return await planets.find(
    {},
    {
      __v: 0,
      _id: 0,
    }
  );
}

async function savePlanet(data) {
  try {
    await planets.updateOne(
      {
        keplerName: data.kepler_name,
      },
      {
        keplerName: data.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
