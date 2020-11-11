CREATE TABLE WeatherLocation(
  city VARCHAR(50)
  forecast VARCHAR(255)
  valid_date date
);
-- function WeatherLocation(city, weatherData) {
--   this.search_query = city;
--   this.forecast = weatherData.weather.description;
--   this.time = weatherData.valid_date;