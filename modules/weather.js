'use strict';

const axios = require('axios');

async function getWeather (request, response, next) {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let numOfDays = 7;

    // commenting out this line since lat/lon from LocationIQ API is not matching the sample data
    //let weatherData = data.find(element => element.city_name === searchQuery && element.lat === lat && element.lon === lon);
    // let cityWeatherData = data.find(element => element.city_name === cityName);

    let weatherDataUrl = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=${numOfDays}`;
    let weatherData = await axios.get(weatherDataUrl);
    let forecastList = weatherData.data.data.map(element => new Forecast(element));
    response.status(200).send(forecastList);
  } catch(error) {
    next(error);
    response.status(500).send(error.message);
  }
}

class Forecast {
  constructor(forecastData) {
    this.date = forecastData.datetime;
    this.description = `Low of ${forecastData.low_temp}, high of ${forecastData.max_temp} with ${forecastData.weather.description}`;
  }
}

module.exports = getWeather;
