const pool = require("../db/db");

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
    throw new Error("Something wrong happened");
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
    return gameStatus;
  } catch (error) {
    //console.log(err);
    throw new Error("Something wrong happened");
  }
};

const invalidRoom = async (roomId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const data = await client.query(
      `UPDATE rooms SET
       game_status = 'invalid',
       initialize_at = NOW()
       WHERE id =$1`,
      [roomId]
    );
    await client.query("COMMIT");

    return "Room is expired";
  } catch (err) {
    throw new Error("something wrong happened");
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
    throw new Error("Something went wrong");
  }
};

const findRoomId = async (playerId, roomId) => {
  try {
    const roomIsFound = await pool.query(
      `SELECT id, player1_id, player2_id, game_status,
       created_at, initialize_at FROM rooms 
       WHERE rooms.id = $1 AND (player1_id = $2 OR player2_id = $2)
      `,
      [roomId, playerId]
    );
    return roomIsFound.rows[0];
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};

const findGameId = async (playerId, roomId) => {
  try {
    const gameIsFound = await pool.query(
      `SELECT 
        rooms.*, 
        users.avatar,
        users.name
      FROM rooms
      JOIN users
        ON users.id = $2 
       WHERE rooms.id = $1 AND (player1_id = $2 OR player2_id = $2)
      `,
      [roomId, playerId]
    );
    return gameIsFound.rows[0];
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};

const submitHand = async (handPosition, position, roomId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (position == 1) {
      await client.query(
        `UPDATE rooms SET
          hand_position_p1 = $1,
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
          hand_position_p2 = $1,
          WHERE id =$2`,
        [handPosition, roomId]
      );
      await client.query("COMMIT");
      return {
        handPosition: "isSubmitted",
        position: position,
      };
    } else {
      throw new Error("User position is unknown");
    }
  } catch (err) {
    throw new Error("something went wrong");
  }
};

// const setWinLose = async (roomId) => {
//   const client = await pool.connect();
//   try {
//     const result = await.client.query(
//       `SELECT win, lose FROM rooms WHERE id = $1`,
//       [roomId]
//     );

//     return result.rows[0];
//   }
// }

const setWinLose = async (roomId, winner, loser) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE rooms SET
      game_status = "finished",
      finish_at = now(),
      win = $1,
      lose = $2
      WHERE id = $3`,
      [roomId, winner, loser]

    );
    await client.query(
      `UPDATE users SET point = point + 10 WHERE id = $1`,
      [winner]
    );
    await client.query(
      `UPDATE users 
      SET point = CASE
        WHEN point < 5 AND id = $1 THEN 0
        WHEN point >= 5 AND id = $1 THEN point - 5 END`,
      [loser]
    );
    return {win: winner, lose: loser, game_status: "finished"}
  } catch (err) {
    await client.query("ROLLBACK");
    throw new Error("Failed to update points")
  }
};

module.exports = {
  createRoom,
  findRoomById,
  joinRoom,
  invalidRoom,
  findRoomId,
  findGameId,
  submitHand,
  setWinLose,
};