'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express('.');

const PORT = process.env.PORT || 5000;
app.use(cors());
// app.use(express.static('./public'));
app.get('/', (req, res) => {
  res.send('Homepage');
})

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

app.get('/weather', handleWeather);

function handleWeather(request, response) {
  try {
    let weatherData = require('./data/weather.json');
    let city = request.query.city_name;
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

app.get('/webpage', (request, response) => {
  response.send('cool, you found a website');
});

app.use('*', (request, response) => {
  response.status(404).send('sorry, not found!');
})

app.listen(PORT, () => {
  console.log('server up');
})


