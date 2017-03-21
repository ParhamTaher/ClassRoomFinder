DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS classrooms CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE buildings 
(
    building_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    address VARCHAR(50) NOT NULL,
    number_of_classrooms integer NOT NULL,
    closing_time TIMESTAMP,
    lat real NOT NULL,
    lon real NOT NULL
);

CREATE TABLE classrooms
(
    room_id SERIAL PRIMARY KEY,
    building_id REFERENCES buildings (building_id),
    code VARCHAR(10) NOT NULL,,
    occupancy integer NOT NULL,
    is_lab boolean NOT NULL 
);

CREATE TABLE users
(
    user_id SERIAL PRIMARY KEY,
    
);

CREATE TABLE bookings
(
	booking_id SERIAL PRIMARY KEY,
    classroom_id int NOT NULL REFERENCES classrooms (room_id),
    building_id int NOT NULL REFERENCES buildings (building_id),
    name VARCHAR(30) NOT NULL,
    message VARCHAR(50),
    duration integer NOT NULL,
    booking_date DATE NOT NULL
);