DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS classrooms CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS comments CASCADE;

DROP TYPE IF EXISTS comment_type CASCADE;

CREATE TYPE comment_type AS ENUM ('High', 'Medium', 'Low');

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
    building_id INT NOT NULL REFERENCES buildings (building_id),
    code VARCHAR(10) NOT NULL,
    occupancy integer NOT NULL,
    is_lab boolean NOT NULL 
);

CREATE TABLE users
(
    user_id SERIAL PRIMARY KEY,
    cookie TEXT NOT NULL UNIQUE
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

CREATE TABLE comments
(
    comment_id SERIAL PRIMARY KEY,
    building_id int NOT NULL REFERENCES buildings (building_id),
    title VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    type comment_type
)