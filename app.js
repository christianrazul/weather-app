const apiKey = '46ef736d9c644f079ba170948240304';
const windInformation = document.querySelector('#wind-information');
const weatherDesc = document.querySelector('#weather-description');
const temp_c = document.querySelector('#temp_C');
const loc = document.querySelector('#location');
const formInput = document.querySelector('.form-field');
const datetime = document.querySelector('#datetime');

// function that fetches data from the API and takes in a location as an argument
const getData = async location => {
  const response = await fetch('http://api.weatherapi.com/v1/current.json?key=' + apiKey + '&q=' + location, {
    mode: 'cors',
  });
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

// function that updates the UI with the weather data
const updateUI = async location => {
  const weatherData = await processData(location);

  // update the UI
  windInformation.innerHTML = `
  ${weatherData.wind_direction}, ${weatherData.wind_kph} km/h`;

  weatherDesc.innerHTML = ` <img src='${weatherData.icon}' class='weather-icon'/> ${weatherData.condition} `;
  // put the weatherData icon in an img tag

  loc.innerHTML = `${weatherData.locationName}, ${weatherData.locationCountry}`;

  temp_c.innerHTML = `${weatherData.temperature}°C`;

  // RIGHT
  const date = new Date();
  datetime.innerHTML = `${date.toDateString()} | ${date.toLocaleTimeString()} `;
};

updateUI('Davao');
