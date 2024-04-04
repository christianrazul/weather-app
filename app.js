const apiKey = '46ef736d9c644f079ba170948240304';
const p = document.querySelector('#weatherInfo');
const temp_c = document.querySelector('#temp_C');
const loc = document.querySelector('#location');
const formInput = document.querySelector('.form-field');

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
  };
  // fetch data and receive a promise
  const data = await getData(location);

  // update the values from the data object
  weatherData.locationName = data.location.name;
  weatherData.locationCountry = data.location.country;
  weatherData.temperature = data.current.temp_c;
  weatherData.condition = data.current.condition.text;
  weatherData.icon = data.current.condition.icon;

  return weatherData;
};

// function that updates the UI with the weather data
const updateUI = async location => {
  const weatherData = await processData(location);

  // update the UI
  p.innerHTML = `
    <h2>${weatherData.locationName}</h2>
    <h3>${weatherData.temperature}°C</h3>
    <p>${weatherData.condition}</p>
    <img src="${weatherData.icon}" alt="weather icon" />
  `;

  loc.innerHTML = `${weatherData.locationName}, ${weatherData.locationCountry}`;

  temp_c.innerHTML = `${weatherData.temperature}°C`;
};

updateUI('Davao');
