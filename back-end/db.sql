DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS classrooms CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS favourites CASCADE;
DROP TABLE IF EXISTS building_hours CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;

DROP TYPE IF EXISTS day CASCADE;

CREATE TYPE day AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');


CREATE TABLE buildings 
(
    building_id SERIAL PRIMARY KEY,
    code VARCHAR(5) UNIQUE, 
    name TEXT NOT NULL UNIQUE,
    address VARCHAR(100) NOT NULL,
    num_rooms integer NOT NULL,
    lat real NOT NULL,
    lon real NOT NULL
);

CREATE TABLE building_hours
(
    schedule_id SERIAL PRIMARY KEY,
    building_id INT NOT NULL REFERENCES buildings (building_id),
    day day NOT NULL,
    open_time TIME NOT NULL,
    closing_time TIME NOT NULL,
    UNIQUE (building_id, day)

);
CREATE TABLE classrooms
(
    room_id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    occupancy integer NOT NULL,
    is_lab boolean NOT NULL 
);

CREATE TABLE users
(
    user_id SERIAL PRIMARY KEY,
    cookie TEXT NOT NULL UNIQUE
);

CREATE TABLE favourites
(
    fav_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (user_id),
    building_id INT NOT NULL REFERENCES buildings (building_id),
    UNIQUE (user_id, building_id)
);

CREATE TABLE bookings
(
	booking_id SERIAL PRIMARY KEY,
    user_id int NOT NULL REFERENCES users (user_id),
    classroom_id int NOT NULL REFERENCES classrooms (room_id),
    building_id int NOT NULL REFERENCES buildings (building_id),
    message VARCHAR(50) NOT NULL,
    tags VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    booking_date DATE NOT NULL
);

CREATE TABLE schedules
(
    schedule_id SERIAL PRIMARY KEY,
    classroom_id int NOT NULL REFERENCES classrooms (room_id),
    building_id int NOT NULL REFERENCES buildings (building_id),
    activity VARCHAR(20) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL
);

CREATE TABLE comments
(
    comment_id SERIAL PRIMARY KEY,
    building_id int NOT NULL REFERENCES buildings (building_id),
    user_id int NOT NULL REFERENCES users (user_id),
    title VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
)