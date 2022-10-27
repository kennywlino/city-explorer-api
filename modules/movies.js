'use strict';

const axios = require('axios');

async function getMovies (request, response, next) {
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
}

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

module.exports = getMovies;
