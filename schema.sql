DROP TABLE IF EXISTS location;

CREATE TABLE location (
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(254),
  formated_query VARCHAR(254),
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6)
);



