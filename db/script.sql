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
    game_status character varying(20) ,
    hand_position_p1 character varying(20) ,
    hand_position_p2 character varying(20) ,
    draw BOOLEAN DEFAULT false,
    win INT,
    lose INT,
    created_at TIMESTAMP DEFAULT NULL,
    initialize_at TIMESTAMP DEFAULT NULL,
    finish_at TIMESTAMP DEFAULT NULL
)