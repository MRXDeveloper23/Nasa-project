const launchesDb = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

async function loadLaunchData(){
  console.log("Downloading launches data...");
}

async function existsLaunchWithId(launchId) {
  return await launchesDb.findOne({
    flightNumber: launchId,
  });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planet found");
  }
  await launchesDb.findOneAndUpdate(
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
async function getLatestFlightNumber() {
  const latestLaunch = await launchesDb
    .findOne()
    .sort("-flightNumber");
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
  return latestLaunch.flightNumber;
}

async function addNewLaunch(launch) {
  const newLaunch = Object.assign(launch, {
    customers: ["ZTM", "NASA"],
    success: true,
    upcoming: true,
    flightNumber: (await getLatestFlightNumber()) + 1,
  });
  await saveLaunch(newLaunch);
}

async function abortLaunchWithId(launchId) {
  try {
    await launchesDb.findOneAndUpdate(
      {
        flightNumber: launchId,
      },
      {
        upcoming: false,
        success: false,
      }
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = {
  loadLaunchData, 
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchWithId,
};
