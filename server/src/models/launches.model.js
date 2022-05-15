const launchesDb = require("./launches.mongo");
const axios = require("axios");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL =
  "https://api.spacexdata.com/v4/launches/query";

async function findLaunch(filter) {
  return await launchesDb.findOne(filter);
}

async function populateLaunches() {
  console.log("Downloading launches data...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  if (response.status !== 200) {
    throw new Error("Error in downloading launches!");
  }
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);
    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data already loaded!");
  } else {
    await populateLaunches();
  }
}

async function existsLaunchWithId(launchId) {
  return await launchesDb.findOne({
    flightNumber: launchId,
  });
}

async function saveLaunch(launch) {
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

async function getAllLaunches(skip, limit) {
  return await launchesDb
    .find(
      {},
      {
        __v: 0,
        _id: 0,
      }
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}
async function getLatestFlightNumber() {
  const latestLaunch = await launchesDb
    .findOne()
    .sort("-flightNumber");
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
  return latestLaunch.flightNumber;
}

async function addNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planet found");
  }
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
