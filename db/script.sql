CREATE TABLE users (
    email character varying(255) NOT NULL UNIQUE,
    id BIGSERIAL NOT NULL PRIMARY KEY,
    username character varying(20) NOT NULL UNIQUE,
    name character varying(255) NOT NULL,
    password text,
    avatar character varying(255),
    point INT DEFAULT 0
);

CREATE TABLE rooms (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    player1_id BIGINT NOT NULL REFERENCES users(id),
    player2_id BIGINT REFERENCES users(id),
    game_status character varying(20) NOT NULL CHECK (game_status IN ('waiting', 'playing','finished', 'invalid')),
    hand_position_p1 character varying(20) NOT NULL CHECK (hand_position_p1 IN ('paper', 'rock','scissor')),
    hand_position_p2 character varying(20) NOT NULL CHECK (hand_position_p2 IN ('paper', 'rock','scissor')),
    draw BOOLEAN DEFAULT false,
    win INT,
    lose INT,
    created_at TIMESTAMP DEFAULT NOW(),
    initialize_at TIMESTAMP DEFAULT NOW(),
    finish_at TIMESTAMP DEFAULT NOW()

)