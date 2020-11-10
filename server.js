'use strict';

require('dotenv').config();

let weatherLocation = [];
const express = require('express');
const cors = require('cors');
const app = express('.');

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.static('./public'));
app.get('/', (req, res) => {
  res.send('Homepage');
})

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


function handleWeather(request, response) {
  try {
    let weatherData = require('./data/weather.json');
    let cityWeather = request.query.city;
    // let newArray = weatherData.data;
    weatherData.data.forEach(element => {
      new WeatherLocation(cityWeather, element);
    });
    response.send(weatherLocation);
    // do i need an array to even out location data?
    // response.send(locationWeather);
  } catch (error) {
    console.error(error);
  }
}

function WeatherLocation(city, weatherData) {
  this.search_query = city;
  this.forecast = weatherData.weather.description;
  this.time = weatherData.valid_date;
  console.log(this.time, this.forecast);

}
app.get('/weather', handleWeather);
app.get('/location', handleLocation);

app.get('/webpage', (request, response) => {
  response.send('cool, you found a website');
});

app.use('*', (request, response) => {
  response.status(404).send('sorry, not found!');
})

app.listen(PORT, () => {
  console.log('server up');
})


