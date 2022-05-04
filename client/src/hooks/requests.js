const API_URL = "http://localhost:8000/v1";

async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  console.log(response);
  return await response.json();
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${API_URL}/launches`);
  const data = await response.json();
  return data.sort(
    (a, b) => a.flightNumber - b.flightNumber
  );
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      body: JSON.stringify(launch),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    });
  } catch (err) {
    return {
      ok: false,
    };
  }

  // Delete launch with given ID.
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};
