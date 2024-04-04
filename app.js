// ENV API key
const apiKey = '46ef736d9c644f079ba170948240304';

// Weather Information
const windInformation = document.querySelector('#wind-information');
const weatherDesc = document.querySelector('#weather-description');
const temp_c = document.querySelector('#temp_C');
const loc = document.querySelector('#location');
const datetime = document.querySelector('#datetime');

// Forecast
const forecast = document.querySelector('.forecast');
const forecastDay = document.querySelector('.forecast-day');
const forecastIcon = document.querySelector('.forecast-icon');

// Search input
const formInput = document.querySelector('.form-field');
const searchBtn = document.querySelector('#search-btn');

// Default values
let defaultLocation = 'Davao';

// Event listener for the search button
searchBtn.addEventListener('click', event => {
  event.preventDefault();
  const location = formInput.value;
  startApp(location);
});

// function that fetches data from the API and takes in a location as an argument
const getData = async (location, days) => {
  const response = await fetch(
    'https://api.weatherapi.com/v1/forecast.json?key=' +
      apiKey +
      '&q=' +
      location +
      '&days=' +
      days +
      '&aqi=no&alerts=no',
    { mode: 'cors' }
  );
  const data = await response.json();
  return data;
};
// Process data from the API and return an object
const processData = async location => {
  const weatherData = {
    locationName: '',
    locationCountry: '',
    temperature: '',
    condition: '',
    icon: '',
    wind_kph: '',
    wind_direction: '',
  };
  // fetch data and receive a promise
  const data = await getData(location);

  // update the values from the data object
  weatherData.locationName = data.location.name;
  weatherData.locationCountry = data.location.country;
  weatherData.temperature = data.current.temp_c;
  weatherData.condition = data.current.condition.text;
  weatherData.icon = data.current.condition.icon;
  weatherData.wind_kph = data.current.wind_kph;
  weatherData.wind_direction = data.current.wind_dir;

  return weatherData;
};

// function that updates date and time
const updateDateTime = () => {
  const now = new Date();

  // get the current date and time as a string
  const currentDateTime = `${now.toDateString()} | ${now.toLocaleTimeString()} `;

  // update the UI with the current date and time
  datetime.innerHTML = currentDateTime;
};

// function that updates forecast data using data from the API
const updateForecast = async (location, days) => {
  const forecastData = await getData(location, days);

  // get the forecast days array from forecastData
  const forecastDays = forecastData.forecast.forecastday;

  const forecastList = document.querySelector('.forecast-list');

  // render forecastDays inside forecastList
  forecastList.innerHTML = '';
  forecastDays.forEach(day => {
    const date = new Date(day.date);

    // main div that will contain the forecast data
    const forecastDay = document.createElement('div');
    forecastDay.classList.add('forecast-day');

    const icon = document.createElement('img');
    icon.classList.add('forecast-icon');
    icon.src = day.day.condition.icon;
    forecastDay.appendChild(icon);

    const info = document.createElement('div');
    info.classList.add('forecast-info');
    forecastDay.appendChild(info);

    const dayName = document.createElement('p');
    dayName.textContent = `${date.toLocaleDateString('en-US', {
      weekday: 'long',
    })}, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    info.appendChild(dayName);

    const condition = document.createElement('p');
    condition.textContent = day.day.condition.text;
    info.appendChild(condition);

    const temp = document.createElement('h2');
    temp.textContent = `${Math.ceil(day.day.avgtemp_c)}°`;
    forecastDay.appendChild(temp);

    forecastList.appendChild(forecastDay);
  });
};

const updateHourlyWeather = async location => {
  const hourlyData = await getData(location);
  const currentHour = new Date().getHours();
  console.log(currentHour);

  // get the hourly forecast array from hourlyData
  const hourlyForecast = hourlyData.forecast.forecastday[0].hour;

  console.log(hourlyForecast);

  const hourlyList = document.querySelector('.hourly-weather-list');
  // clear list
  hourlyList.innerHTML = '';

  hourlyForecast.slice(currentHour, currentHour + 7).forEach(hour => {
    // convert hour to a date object
    let date = new Date(hour.time);
    let cleanedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    // main card that all children will be appended to
    const hourlyWeatherCard = document.createElement('div');
    hourlyWeatherCard.classList.add('hourly-weather-card');

    const time = document.createElement('p');
    time.textContent = cleanedTime;
    hourlyWeatherCard.appendChild(time);

    const hr = document.createElement('hr');
    hourlyWeatherCard.appendChild(hr);

    const icon = document.createElement('img');
    icon.classList.add('forecast-icon');
    icon.src = hour.condition.icon;
    hourlyWeatherCard.appendChild(icon);

    const temp = document.createElement('p');
    temp.textContent = `${Math.ceil(hour.temp_c)}°C`;
    hourlyWeatherCard.appendChild(temp);

    hourlyList.appendChild(hourlyWeatherCard);
  });
};

const convertCompassDirection = direction => {
  switch (direction) {
    case 'N':
      return 'North';
    case 'NNE':
      return 'North-Northeast';
    case 'NE':
      return 'Northeast';
    case 'ENE':
      return 'East-Northeast';
    case 'E':
      return 'East';
    case 'ESE':
      return 'East-Southeast';
    case 'SE':
      return 'Southeast';
    case 'SSE':
      return 'South-Southeast';
    case 'S':
      return 'South';
    case 'SSW':
      return 'South-Southwest';
    case 'SW':
      return 'Southwest';
    case 'WSW':
      return 'West-Southwest';
    case 'W':
      return 'West';
    case 'WNW':
      return 'West-Northwest';
    case 'NW':
      return 'Northwest';
    case 'NNW':
      return 'North-Northwest';
    default:
      return '';
  }
};

// function that updates the UI with the weather data
const updateUI = async location => {
  const weatherData = await processData(location);

  // update the UI
  windInformation.innerHTML = `${convertCompassDirection(weatherData.wind_direction)} at ${weatherData.wind_kph} km/h`;

  weatherDesc.innerHTML = ` <img src='${weatherData.icon}' class='weather-icon'/> ${weatherData.condition} `;
  // put the weatherData icon in an img tag

  loc.innerHTML = `${weatherData.locationName}, ${weatherData.locationCountry}`;

  temp_c.innerHTML = `${weatherData.temperature}°C`;
};

const startApp = location => {
  updateUI(location);
  updateForecast(location, 7);
  updateHourlyWeather(location);
};

setInterval(updateDateTime, 1000);
startApp(defaultLocation);
