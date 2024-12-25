const pool = require("../db/db");

const { DatabaseError } = require("../dto/customErrors");

const createRoom = async (userId, game_status) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const roomResult = await client.query(
      `INSERT INTO rooms (player1_id,game_status,created_at) 
      VALUES ($1, $2, NOW()) 
      RETURNING id, player1_id, player2_id, 
      game_status, hand_position_p1, hand_position_p2, 
      draw, win, lose, created_at, initialize_at, finish_at `,
      [userId, game_status]
    );
    const newRoom = roomResult.rows[0];
    await client.query("COMMIT");
    return newRoom;
  } catch (err) {
    //console.log(err);
    throw new DatabaseError("Something wrong happened");
  }
};

const joinRoom = async (roomId, awayId, gameStatus) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE rooms
      SET player2_id = $1,
          game_status = $2,
          initialize_at = NOW()
      WHERE id = $3;
     `,
      [awayId, gameStatus, roomId]
    );
    await client.query("COMMIT");
    return { roomId: roomId, gameStatus: gameStatus };
  } catch (error) {
    //console.log(err);
    throw new DatabaseError("Something wrong happened");
  }
};

const invalidRoom = async (roomId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE rooms SET
       game_status = 'invalid',
       initialize_at = NOW()
       WHERE id =$1`,
      [roomId]
    );
    await client.query("COMMIT");

    return "Room is expired";
  } catch (err) {
    throw new DatabaseError("something wrong happened");
  }
};

const findRoomById = async (playerId, roomId) => {
  try {
    const result = await pool.query(
      `SELECT *
      FROM rooms
      WHERE rooms.id = $1
      AND rooms.game_status = 'waiting'
      AND rooms.player1_id != $2
      AND rooms.player2_id IS NULL
        `,
      [roomId, playerId]
    );

    return result.rows[0];
  } catch (error) {
    throw new DatabaseError("Something went wrong");
  }
};

const findRoomId = async (playerId, roomId) => {
  try {
    const roomIsFound = await pool.query(
      `SELECT * FROM rooms 
       WHERE rooms.id = $1 AND (player1_id = $2 OR player2_id = $2)
      `,
      [roomId, playerId]
    );
    return roomIsFound.rows[0];
  } catch (err) {
    console.log(err);
    throw new DatabaseError("Something went wrong");
  }
};

const submitHand = async (handPosition, position, roomId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log(roomId, handPosition, position);
    if (position == 1) {
      await client.query(
        `UPDATE rooms SET
          hand_position_p1 = $1
          WHERE id =$2`,
        [handPosition, roomId]
      );
      await client.query("COMMIT");
      return {
        handPosition: "isSubmitted",
        position: position,
      };
    } else if (position == 2) {
      await client.query(
        `UPDATE rooms SET
          hand_position_p2 = $1
          WHERE id =$2`,
        [handPosition, roomId]
      );
      await client.query("COMMIT");
      return {
        handPosition: "isSubmitted",
        position: position,
      };
    } else {
      throw new DatabaseError("User position is unknown");
    }
  } catch (err) {
    throw new DatabaseError("something went wrong");
  }
};

const setWinner = async (roomId, result) => {
  try {
    pool.query(
      `UPDATE rooms SET
      win = $1,
      lose = $2,
      finish_at = NOW(),
      game_status = 'finished'
      WHERE id = $3
      `,
      [result.winner, result.loser, roomId]
    );
    // Update points for the winner
    await pool.query(
      `UPDATE users
      SET point = point + 10
      WHERE id = $1`,
      [result.winner]
    );

    // Update points for the loser, ensuring points don't go negative
    await pool.query(
      `UPDATE users
      SET point = GREATEST(point - 5, 0)
      WHERE id = $1`,
      [result.loser]
    );
    return { win: result.winner, lose: result.loser, game_status: "finished" };
  } catch (err) {
    throw new DatabaseError("something wrong happened");
  }
};
const setDraw = async (roomId, result) => {
  try {
    pool.query(
      `UPDATE rooms SET 
      draw = $2,
      finish_at = NOW(),
      game_status = 'finished'
      WHERE id =$1`,
      [roomId, result]
    );
    return { result: "draw" };
  } catch (err) {
    throw new DatabaseError("Something wrong happened");
  }
};

const gameAgain = async (playerId) => {
  try {
    const roomIsFound = await pool.query(
      `SELECT * FROM rooms 
       WHERE game_status='again' AND (player1_id = $1 OR player2_id = $1)
      `,
      [playerId]
    );
    return roomIsFound.rows[0];
  } catch (err) {
    console.log(err);
    throw new DatabaseError("Something went wrong");
  }
};

module.exports = {
  createRoom,
  findRoomById,
  joinRoom,
  invalidRoom,
  findRoomId,
  submitHand,
  setDraw,
  setWinner,
  gameAgain,
};
