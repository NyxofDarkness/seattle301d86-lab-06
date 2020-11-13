DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS weather;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS trails;
DROP TABLE IF EXISTS movies;

CREATE TABLE location (
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(254),
  formated_query VARCHAR(254),
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
);

CREATE TABLE weather (
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(254),
  forecast VARCHAR(254),
);

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  restaurant VARCHAR(254),
  cuisines VARCHAR(254),
  locality VARCHAR(254),
);

CREATE TABLE trails (
  id SERIAL PRIMARY KEY,
  name VARCHAR(254),
  location VARCHAR(254),
  length VARCHAR(254),
  stars VARCHAR(254),
  stars_votes VARCHAR(254),
  summary VARCHAR(254),
  trail_url VARCHAR(254),
  conditions VARCHAR(254),
  condition_date DATE,
  condition_time DATE,
);
CREATE TABLE movies (
  id SERIAL PRIMARY KEY,

);
