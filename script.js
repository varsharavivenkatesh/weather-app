//http://api.openweathermap.org/data/2.5/air_pollution?q=${searchInput.replace(' ', '%20')},${countryCode}&limit=1&appid=${apiKey}";
//108c0474e6c91520be40842391d3afca
async function fetchaqi() {
  // Step a. Create global variables and start inner functions
  let searchInput = document.getElementById('search').value;
  const weatherDataSection = document.getElementById("AQI_data");
  weatherDataSection.style.display = "block";

  const apiKey = ""

  if (searchInput == "") {
    weatherDataSection.innerHTML = `
    <div>
      <h2>Empty Input!</h2>
      <p>Please try again with a valid <u>city name</u>.</p>
    </div>
    `;
    return;
  }

  // Step b. Get lat and lon coordinates via Geocoding API
  async function getLonAndLat() {
    const countryCode = 1
    const geocodeURL = 'https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}'

    const response = await fetch(geocodeURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }

    const data = await response.json();
    if (data.length == 0) {
      console.log("Something went wrong here.");
      weatherDataSection.innerHTML = `
      <div>
        <h2>Invalid Input: "${searchInput}"</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
      `;
      return;
    } else {
      return data[0];
    }
  }

  async function getWeatherData(lon, lat) {
    // Step c. Get weather information via Current Weather API
    const weatherURL = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat={lat}&lon={lon}&appid={apiKey}`
    const response = await fetch(weatherURL);

    // Step d. Display the weather data
    const data = await response.json();
    const aqi = data.list[0].main.aqi;

      const aqiLevels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
      const aqiDescription = aqiLevels[aqi - 1] || "Unknown";

      weatherDataSection.style.display = "flex";
      weatherDataSection.innerHTML = `
        <div>
          <h2>Air Quality Index (AQI)</h2>
          <p><strong>AQI Level:</strong> ${aqi} (${aqiDescription})</p>
        </div>`;
  }
  // These are part of Step d.
  document.getElementById("search").value = "";
  const geocodeData = await getLonAndLat();
  getWeatherData(geocodeData.lon, geocodeData.lat);
}
