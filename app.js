// SkyFetch Weather Dashboard - Part 1 API Integration

const apiKey = "13739259e308973107b534eb4fecee9"; // Replace with your OpenWeatherMap API key

const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const iconEl = document.getElementById("icon");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const loadingEl = document.querySelector(".loading");
const weatherInfoEl = document.querySelector(".weather-info");

let debounceTimer;

// Function to fetch weather
async function getWeather(city) {
    if (!city || city.trim() === "") {
        weatherInfoEl.style.display = "none";
        return;
    }

    // Show loading
    loadingEl.style.display = "block";
    weatherInfoEl.style.display = "none";
    cityEl.textContent = "";
    tempEl.textContent = "";
    descEl.textContent = "";
    iconEl.style.display = "none";

    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await axios.get(apiURL);
        const data = response.data;

        // Display weather information
        cityEl.textContent = data.name + ", " + data.sys.country;
        tempEl.textContent = `${Math.round(data.main.temp)}°C`;
        descEl.textContent = data.weather[0].description;

        const iconCode = data.weather[0].icon;
        iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        iconEl.style.display = "block";
        
        loadingEl.style.display = "none";
        weatherInfoEl.style.display = "block";
    } catch (error) {
        console.error(error);
        const randomTemp = Math.floor(Math.random() * 50) - 10; // Random temp between -10°C to 40°C
        cityEl.textContent = "Unknown City";
        tempEl.textContent = `${randomTemp}°C`;
        descEl.textContent = "Random temperature";
        loadingEl.style.display = "none";
        weatherInfoEl.style.display = "block";
    }
}

// Debounce function to prevent too many API calls
function debounceSearch(city) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        getWeather(city);
    }, 500);
}

// Event Listeners
searchBtn.addEventListener("click", () => {
    getWeather(cityInput.value);
});

cityInput.addEventListener("input", () => {
    debounceSearch(cityInput.value);
});

cityInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        clearTimeout(debounceTimer);
        getWeather(cityInput.value);
    }
});