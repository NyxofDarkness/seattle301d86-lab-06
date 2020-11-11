'use strict';

require('dotenv').config();


const express = require('express');
const superagent = require('superagent');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express('.');
const PORT = process.env.PORT || 5000;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const ZOMATO_API_KEY = process.env.ZOMATO_API_KEY;
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;

app.use(cors());
// checks done to here. all green
// locationIQ Api to give us the lat, lon information, we use to feed into Zomato API to get back specific restraunts

app.use(express.static('./public'));
app.get('/', (req, res) => {
  res.send('Homepage');
})
// app.get('/restaurants', handleRestaurants)
app.get('/location', handleLocation);
app.get('/weather', handleWeather);
app.get('/restaurants', handleRestaurants);

app.get('*', handleNotFound);
// put this at the bottom after all other route handlers!

// function handleLocation(request, response) {
//   try {
//     let geoData = require('./data/location.json');
//     let city = request.query.city;
//     let locationData = new Location(city, geoData);
//     response.send(locationData);
//   } catch (error) {
//     console.error(error);
//   }
// }
function handleLocation(req, res) {
  let city = req.query.city;
  let url = `http://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json&limit=1`;
  let locations = {};

  if (locations[url]) {
    res.send(locations[url]);
  } else {
    superagent.get(url)
      .then(data => {
        const geoData = data.body[0];
        const location = new Location(city, geoData);
        locations[url] = location;
        res.json(location);
      })
      .catch(() => {
        console.error('Try Again')
      })
  }
}

function handleRestaurants(req, res) {
  const url = `https://developers.zomato.com/api/v2.1/geocode`
  const queryParameters = {
    lat: req.query.latitude,
    lng: req.query.longitude
  }
  superagent.get(url)
    .query(queryParameters)
    .set('user-key, ZOMATO_API_KEY')
    .then(data => {
      const results = data.body;
      const restaurantData = [];

      results.nearby_restaurants.forEach(item => {
        restaurantData.push(new Restaurant(item));
      });
      res.json(restaurantData);
    })
}


function handleWeather(req, res) {
  let city = req.query.search_query;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${WEATHERBIT_API_KEY}`
  console.log(url);
  superagent.get(url)
    .then(data => {
      console.log(data.body.data);
      // const results = data.body;
      const weatherData = data.body.data.map(date => new WeatherLocation(city, date));
      res.json(weatherData);
    })
    .catch(error => console.error(error))
}
//   if (req.query.city !== '') {
//     try {
//       let weatherData = require('./data/weather.json');
//       let cityWeather = req.query.cityWeather;
//       let weatherDataObject = new WeatherLocation(cityWeather, weatherData);
//       let weatherArray = [];
//       weatherArray.push(weatherDataObject);
//       res.send(weatherArray);
//     } catch (error) {
//       console.error(error);
//     }
//   } else {
//     res.status(500).send('Sorry, something went wrong');
//   }

// }

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}
function WeatherLocation(city, weatherData) {
  this.search_query = city;
  this.forecast = weatherData.weather.description;
  this.time = weatherData.valid_date;
  // weatherArray.push(this);
}
function Restaurant(entry) {
  this.restaurant = entry.restaurant.name;
  this.cuisines = entry.restaurant.cuisines;
  this.locality = entry.restaurant.location.locality;
}

function handleNotFound(req, res) {
  res.status(404).send('not found');
}

app.get('/webpage', (req, res) => {
  res.send('cool, you found a website');
});

app.use('*', (req, res) => {
  res.status(404).send('sorry, not found!');
})

app.listen(PORT, () => {
  console.log(`server up: ${PORT}`);
})


