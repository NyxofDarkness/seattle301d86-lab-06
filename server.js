'use strict'
require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log('server up');
})

