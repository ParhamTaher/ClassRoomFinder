DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS classrooms CASCADE;


CREATE TABLE building 
(
    building_id PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    address VARCHAR(50),
    number_of_classrooms integer,
    closing_time TIMESTAMP
);

CREATE TABLE classrooms
(
    room_id PRIMARY KEY,
    code VARCHAR(10),
    occupancy integer,
);

CREATE TABLE bookings
(
    classroom_id FOREIGN KEY,
    building_id FOREIGN KEY,
    name VARCHAR(30),
    message VARCHAR(50),
    duration integer,
    date DATE,
);