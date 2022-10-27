'use strict';

// ***** REQUIRES *****

const express = require('express');

require('dotenv').config();

const cors = require('cors');
const axios = require('axios');

// let data = require('./data/weather.json');


// once express is in we need to use it -- per express docs
// app === server
const app = express();

// middleware to share resources across the internet
app.use(cors());


// define my port
const PORT = process.env.PORT || 3002;
// 3002 -- if my server is up on 3002, then I know there's something wrong with my .env file or I didn't bring in dotenv library

// ***** ENDPOINTS *****

// Base endpoint

app.get('/', (request, response) => {
  console.log('This is showing up in my terminal!');
  response.status(200).send('Welcome to my server');
});

app.get('/movies', async (request, response, next) => {
  try {
    let cityName = request.query.searchQuery;

    let movieDataUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&include_adult=false&query=${cityName}`;
    let movieData = await axios.get(movieDataUrl);
    let movieDataProcessed = movieData.data.results.map(element => new Movie(element));
    response.status(200).send(movieDataProcessed);
  } catch(error) {
    next(error);
    response.status(500).send(error.message);
  }
});

class Movie {
  constructor(movieData) {
    this.title = movieData.title;
    this.overview = movieData.overview;
    this.average_votes = movieData.vote_average;
    this.total_votes = movieData.vote_count;
    this.poster_path = movieData.poster_path ? 'https://image.tmdb.org/t/p/w500' + movieData.poster_path : null;
    this.backdrop_path = this.backdrop_path ? 'https://image.tmdb.org/t/p/w500' + movieData.backdrop_path : null;
    this.popularity = movieData.popularity;
    this.release_date = movieData.release_date;
  }
}

app.get('/weather', async (request, response, next) => {
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
});

class Forecast {
  constructor(forecastData) {
    this.date = forecastData.datetime;
    this.description = `Low of ${forecastData.low_temp}, high of ${forecastData.max_temp} with ${forecastData.weather.description}`;
  }
}

// catch all and should live at the bottom
app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

// ***** ERROR HANDLING *****
// ERRORS
// Handle any errors -- middleware?
/* app.use((error, request, response, next)) => {
    response.status(500).send(error.message);
}); */

// ***** SERVER START *****
app.listen(PORT, () => console.log(`We are up and running on port ${PORT}`));
