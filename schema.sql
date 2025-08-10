DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);


DROP TABLE IF EXISTS scores; 

CREATE TABLE scores (
    username VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    countdown FLOAT NOT NULL
);

INSERT INTO scores (username, score, countdown) VALUES (" c ", " 322 ", " 222 ")
SELECT * FROM scores