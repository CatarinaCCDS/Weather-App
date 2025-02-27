const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "8d640c63361db8d1f95afba6c53c3012";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value.trim(); // Trim whitespace

    if(city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError("City not found. Please try again.");
        }
    } else {
        displayError("Please enter a city");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("City not found");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    const { name: city, main: { temp, humidity }, weather } = data;
    const [{ description, id }] = weather;

    card.innerHTML = "";  // Clear previous content
    card.style.display = "flex"; 
    card.style.background = getWeatherBackground(id);

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const dateDisplay = document.createElement("p");
    const timeDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherDisplay = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `Temperature: ${temp.toFixed(1)}°C`;
    dateDisplay.textContent = `${new Date().toLocaleDateString()}`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherDisplay.textContent = displayWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    dateDisplay.classList.add("dateDisplay");
    timeDisplay.classList.add("timeDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherDisplay.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(dateDisplay);
    card.appendChild(timeDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherDisplay);

    function updateTime() {
        timeDisplay.textContent = `${new Date().toLocaleTimeString()}`;
    }

    updateTime();
    setInterval(updateTime, 1000);
}

function getWeatherBackground(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300): // Thunderstorm
            return "linear-gradient(180deg, hsl(240, 60%, 30%), hsl(280, 80%, 40%))"; // Dark purple stormy
        case (weatherId >= 300 && weatherId < 600): // Rain
            return "linear-gradient(180deg, hsl(210, 60%, 40%), hsl(200, 80%, 50%))"; // Blue-gray rain
        case (weatherId >= 600 && weatherId < 700): // Snow
            return "linear-gradient(180deg, hsl(0, 0%, 90%), hsl(210, 50%, 80%))"; // White/light blue
        case (weatherId >= 700 && weatherId < 800): // Fog/Mist
            return "linear-gradient(180deg, hsl(0, 0%, 60%), hsl(0, 0%, 80%))"; // Gray foggy
        case (weatherId === 800): // Clear sky
            return "linear-gradient(180deg, hsl(210, 100%, 50%), hsl(40, 100%, 75%))"; // Bright blue & yellow
        case (weatherId >= 801 && weatherId < 810): // Clouds
            return "linear-gradient(180deg, hsl(210, 30%, 60%), hsl(210, 50%, 70%))"; // Soft gray-blue
        default: // Unknown
            return "linear-gradient(180deg, hsl(0, 0%, 50%), hsl(0, 0%, 70%))"; // Neutral gray
    }
}

function displayWeatherEmoji(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId === 800):
            return "☀️";
        case (weatherId >= 801 && weatherId < 810):
            return "☁️";
        default:
            return "❓";
    }
}

function displayError(message) {
    card.innerHTML = ""; 
    card.style.display = "flex";

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.appendChild(errorDisplay);
}
