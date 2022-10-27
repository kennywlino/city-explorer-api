'use strict';

// ***** REQUIRES *****

const express = require('express');

require('dotenv').config();

const cors = require('cors');
const axios = require('axios');

const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies');


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

app.get('/movies', getMovies); 
app.get('/weather', getWeather);


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
