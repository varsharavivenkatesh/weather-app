async function fetchaqi() {
    const searchInput = document.getElementById('search').value.trim();
    const weatherDataSection = document.getElementById("AQI_data");
    const apiKey = "";
  
    // Display the AQI data section
    weatherDataSection.style.display = "block";
  
    if (!searchInput) {
      weatherDataSection.innerHTML = `
        <div>
          <h2>Empty Input!</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>`;
      return;
    }
  
    // Step b: Get lat and lon via Geocoding API
    async function getLonAndLat(cityName) {
      const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
  
      try {
        const response = await fetch(geocodeURL);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: Unable to fetch geocode data.`);
        }
  
        const data = await response.json();
        if (data.length === 0) {
          throw new Error("No location found for the given input.");
        }
  
        return { lon: data[0].lon, lat: data[0].lat };
      } catch (error) {
        weatherDataSection.innerHTML = `
          <div>
            <h2>Error</h2>
            <p>${error.message}</p>
          </div>`;
        console.error(error);
      }
    }
  
    // Step c: Get AQI data
    async function getWeatherData(lon, lat) {
      const weatherURL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  
      try {
        const response = await fetch(weatherURL);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: Unable to fetch AQI data.`);
        }
  
        const data = await response.json();
        const aqi = data.list[0].main.aqi;
  
        const aqiLevels = ["Good-You can burst Crackers", "Fair-Burst Crackers with moderation", "Moderate-You can burst a few Crackers ", "Poor- Don't burst Crackers", "Very Poor- Don't even think about bursting crackers"];
        const aqiDescription = aqiLevels[aqi - 1] || "Unknown";
  
        weatherDataSection.style.display = "flex";
        weatherDataSection.innerHTML = `
          <div>
            <h2>Air Quality Index (AQI)</h2>
            <p><strong>AQI Level:</strong> ${aqi} (${aqiDescription})</p>
          </div>`;
      } catch (error) {
        weatherDataSection.innerHTML = `
          <div>
            <h2>Error</h2>
            <p>${error.message}</p>
          </div>`;
        console.error(error);
      }
    }
  
    // Step d: Coordinate API calls
    const geocodeData = await getLonAndLat(searchInput);
    if (geocodeData) {
      await getWeatherData(geocodeData.lon, geocodeData.lat);
    }
  
    // Clear the search input
    document.getElementById("search").value = "";
  }
  
