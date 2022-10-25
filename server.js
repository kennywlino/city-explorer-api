'use strict';


const { response } = require('express');

// ***** REQUIRES *****

const express = require('express');

require('dotenv').config();

const cors = require('cors');

let data = require('./data/weather.json');


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

app.get('/hello', (request, response) => {
  console.log(request.query);
  let firstName = request.query.firstName;
  let lastName = request.query.lastName;
  response.status(200).send(`Hello ${firstName} ${lastName}! Welcome to my server!`);
});

app.get('/weather', (request, response, next) => {
  try {
    let searchQuery = request.query.searchQuery;
    let lat = request.query.lat;
    let lon = request.query.lon;


    let weatherData = data.find(element => element.city_name === searchQuery && element.lat === lat && element.lon === lon);
    let forecastList = weatherData.data.map(element => new Forecast(element));
    console.log(forecastList);
    response.status(200).send(forecastList);
  } catch(error) {
    next(error);
  }
});

class Forecast {
  constructor(forecastData) {
    this.date = forecastData.datetime;
    this.description = `Low of ${forecastData.low_temp}, high of ${forecastData.max_temp} with ${forecastData.weather.description}`;
  }
}


// with Audrey's pets example
// get pets data from her repo
/* app.get('/pet', (request, response, next) => {
  try {
    let species = request.query.species;
    let petData = data.find(pet => pet.species === species);
    // must send response or the browser will spool or loop over and over
    response.status(200).send(petData);
  } catch(error) {
    next(error);
  }
}); */

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
