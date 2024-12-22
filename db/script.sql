CREATE TYPE gamestat AS ENUM ('waiting', 'playing', 'finished', 'invalid');
CREATE TYPE handpost AS ENUM ('rock', 'paper', 'scissors');

CREATE TABLE users (
    email character varying(255) NOT NULL UNIQUE,
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name character varying(255) NOT NULL,
    password text NOT NULL,
    avatar text NOT NULL,
    point INT NOT NULL DEFAULT 0 
);

CREATE TABLE rooms (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    player1_id BIGINT NOT NULL REFERENCES users(id),
    player2_id BIGINT REFERENCES users(id),
    game_status gamestat,
    hand_position_p1 handpost,
    hand_position_p2 handpost,
    draw BOOLEAN DEFAULT false,
    win INT,
    lose INT,
    created_at TIMESTAMP DEFAULT NULL,
    initialize_at TIMESTAMP DEFAULT NULL,
    finish_at TIMESTAMP DEFAULT NULL
)