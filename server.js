'use strict';

require('dotenv').config();

const express = require('express');
const pg = require('pg'); //between server and database!
const superagent = require('superagent');
const cors = require('cors');
const client = new pg.Client(process.env.DATABASE_URL);
const app = express();
const PORT = process.env.PORT || 5000;
// api key routes
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY; ///SQL hooked up
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;
const TRAIL_API_KEY = process.env.TRAIL_API_KEY;
const MOVIES_API_KEY = process.env.MOVIES_API_KEY;
const YELP_API_KEY = process.env.YELP_API_KEY;

// const yelp = require('yelp-fusion'); //okay trying this later
//things the app needs
app.use(cors());
app.use(express.static('./public'));
app.get('/', (req, res) => {
  res.send('Homepage');
})
//get the things
app.get('/location', handleLocation);
app.get('/weather', handleWeather);
app.get('/trails', handleTrails);
// app.get('/yelp', handleRestaurants);
// app.get('/movies', handleMovies);



// functions to request info from API, gets the info back to sql, displays in table in terminal, and displays on page using user input
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
        let SQL = 'INSERT INTO location (search_query, formated_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *';
        let values = [location.search_query, location.formatted_query, location.latitude, location.latitude];
        client.query(SQL, values)
          .then(results => {
            console.log('Stuff is coming...', results.rows);
          })
          .catch(error => {
            res.status(500).send(error);
          })
        res.json(location);
      })
      .catch(() => {
        console.error('Try Again')
      })
  }
}

// function handleRestaurants(req, res) {
//   const url = `https://api.yelp.com/v3/businesses/search?`
//   const queryParameters = {
//     lat: req.query.latitude,
//     lng: req.query.longitude
//   }
//   superagent.get(url)
//     .query(queryParameters)
//     .set('user-key, ZOMATO_API_KEY')
//     .then(data => {
//       const results = data.body;
//       const restaurantData = [];
//       results.nearby_restaurants.forEach(item => {
//         restaurantData.push(new Restaurant(item));
//       });
//       let SQL = 'INSERT INTO restaurants (restaurant, cuisines, locality) VALUES ($1, $2, $3) RETURNING *';
//       let values = [restaurants.restaurant, restaurants.cuisines, restaurants.locality];

//       client.query(SQL, values)
//         .then(results => {
//           console.log('stuff is coming...', results.rows);
//         })
//       res.json(restaurantData);
//     })
//     .catch(() => {
//       console.error('Try Again')
//     }
//   }
// }


function handleWeather(req, res) {
  let city = req.query.search_query;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${WEATHERBIT_API_KEY}`
  console.log(url);
  superagent.get(url)
    .then(data => {
      const weatherData = data.body.data.map(weatherData => new WeatherLocation(city, weatherData));
      let SQL = 'INSERT INTO weather (forecast) VALUES ($1) RETURNING *';
      let values = [weatherData.search_query, weatherData.forecast];

      client.query(SQL, values)
        .then(results => {
          console.log('Stuff is coming...', results.rows);
        })
        .catch(error => console.error(error))
      res.json(weatherData);
    })
}

function handleTrails(req, res) {

  let lat = req.query.latitude;
  let lon = req.query.longitude;
  let url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&key=${TRAIL_API_KEY}&format=json`;
  let trails = {};

  if (trails[url]) {
    res.send(trails[url]);
    //// why did they have me put this? 
  } else {
    superagent.get(url)
      .then(trails => {
        const trailData = trails.body;
        Trails.all = trailData.trails.map(object => new Trails(object));
        trails[url] = Trails.all;
        res.json(Trails.all);
      })
      .catch((error) => {
        console.error(error, 'did not work');
      })
  }
}

function Trails(trailForCity) {
  this.name = trailForCity.name;
  this.location = trailForCity.location;
  this.length = trailForCity.length;
  this.stars = trailForCity.stars;
  this.stars_votes = trailForCity.stars_votes;
  this.summary = trailForCity.summary;
  this.trail_url = trailForCity.trail_url;
  this.conditions = trailForCity.conditions;
  this.condition_date = trailForCity.conditions_date;
  this.condition_time = trailForCity.condition_time;
}

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
// function Restaurant(entry) {
//   this.restaurant = entry.restaurant.name;
//   this.cuisines = entry.restaurant.cuisines;
//   this.locality = entry.restaurant.location.locality;
// }

// function handleNotFound(req, res) {
//   res.status(404).send('not found');
// }

app.get('/webpage', (req, res) => {
  res.send('cool, you found a website');
});

app.use('*', (req, res) => {
  res.status(404).send('sorry, not found!');
})

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server up! ${PORT}`);
    });
  })
  .catch(err => {
    console.error(err);
  })

