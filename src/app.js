const key = "YOUR_OPEN_WEATHER_MAP_API_KEY";

const app = document.querySelector("#app");
const title = document.querySelector("#title");
const searchContainer = document.querySelector("#search");
const searchInput = document.querySelector("#searchInput");
const searchForm = document.querySelector("#searchForm");
const weather = document.querySelector("#weather");
const repeatSearch = document.querySelector("#repeatSearch");
const errorMessage = document.querySelector("#errorMessage");
const errorContainer = document.querySelector("#error");

const RAINY = " bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600";
const CLOUDY = " bg-gradient-to-l from-zinc-800 via-blue-900 to-purple-900";
const SUNNY = " bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-900";
const BASE = "container-xl h-screen flex-col justify-center content-center";

function getWeather(location) {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      location +
      "&appid=" +
      key +
      "&units=metric"
  )
    .then(function (resp) {
      hideSearch();
      return resp.json();
    })
    .then(function (data) {
      display(data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function display(data) {
    hideSearch()
  if (data.cod === "404" || data.cod === 401) {
    showError(data.cod);
} else {
    document.querySelector("#description").innerHTML =
      data.weather[0].description;
    document.querySelector("#clouds").innerHTML = data.clouds.all + "%";
    document.querySelector("#temperature").innerHTML = data.main.temp + "&deg;";
    document.querySelector("#temperatureMinMax").innerHTML =
      data.main.temp_min + "&deg;" + " - " + data.main.temp_max + "&deg;";
    document.querySelector("#feelsLike").innerHTML =
      data.main.feels_like + "&deg;";
    document.querySelector("#location").innerHTML =
      data.name +
      ` <span class="inline-block py-1 px-2 leading-none text-center whitespace-nowrap align-baseline font-bold bg-blue-600 text-white rounded-lg">${data.sys.country}</span>`;
    document.querySelector("#wind").innerHTML = data.wind.speed + " m/s";

    if (data.weather[0].description.indexOf("rain") > 0) {
      app.className += RAINY;
      title.className += " text-white";
    } else if (data.weather[0].description.indexOf("cloud") > 0) {
      app.className += CLOUDY;
      title.className += " text-white";
    } else if (data.weather[0].description.indexOf("sunny") > 0) {
      app.className += SUNNY;
      title.className += " text-white";
    } else {
      app.className += " clear";
    }
  }

}

function hideSearch() {
  searchContainer.classList.replace("block", "hidden");
  weather.classList.replace("hidden", "block");
  repeatSearch.classList.replace("hidden", "block");
  searchInput.value = "";
}

function searchRepeat() {
  searchContainer.classList.replace("hidden", "block");
  weather.classList.replace("block", "hidden");
  repeatSearch.classList.replace("block", "hidden");
  errorContainer.classList.replace("block", "hidden");
  searchInput.value = "";
  title.classList.replace("text-white", "text-dark");
  if (
    app.className.includes(CLOUDY) ||
    app.className.includes(RAINY) ||
    app.className.includes(SUNNY)
  ) {
    app.className = BASE;
  }
}

function showError(code) {
    if (code === "404") {
        errorMessage.innerHTML = "Oops... city not found.";
    } else if (code === 401) {
        errorMessage.innerHTML = "Please enter you OpenWeatherMap API key.";
    }

    errorContainer.classList.replace("hidden", "block");
    searchContainer.classList.replace("block", "hidden");
    weather.classList.replace("block", "hidden");
    repeatSearch.classList.replace("hidden", "block");
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeather(searchInput.value);
});

repeatSearch.addEventListener("click", () => {
  searchRepeat();
});
