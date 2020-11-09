'use strict'
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;
app.use(cors());

app.get('/location', handleLocation);

function handleLocation(request, response) {
  try {
    let geoData = require('./data/location.json');
    let city = request.query.city;
    let locationData = new Location(city, geoData);
    response.send(locationData);
  } catch (error) {
    console.error(error);
  }
}

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

app.get('/WeatherLocation', handleweather);

function handleWeather(request, response) {
  try {
    let weatherData = require('./data/weather.json');
    let city = request.query.city;
    let locationWeather = new WeatherLocation(city, weatherData);
    response.send(locationWeather);
  } catch (error) {
    console.error(error);
  }
}

function WeatherLocation(city, weatherData) {
  this.search_query = city;
  this.formatted_query = weatherData[0].city_name;
  this.latitude = weatherData[0].lat;
  this.longitude = weatherData[0].lon;
}


app.use('*', (request, response) => {
  response.status(404).send('sorry, not found!');
})

app.listen(PORT, () => {
  console.log('server up');
})

