const launchesDb = require("./launches.mongo");
const planets = require("./planets.mongo");
const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

// launches.set(launch.flightNumber, launch);
saveLaunch(launch);

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  console.log(planet);
  if (!planet) {
    throw new Error("No matching planet found");
  }
  await launchesDb.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function getAllLaunches() {
  return await launchesDb.find(
    {},
    {
      __v: 0,
      _id: 0,
    }
  );
}
function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      customers: ["ZTM", "NASA"],
      success: true,
      upcoming: true,
      flightNumber: latestFlightNumber,
    })
  );
}

function abortLaunchWithId(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchWithId,
};
