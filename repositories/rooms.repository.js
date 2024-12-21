const pool = require("../db/db");

const createRoom = async (userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const roomResult = await client.query(
      `INSERT INTO rooms (player1_id) 
      VALUES ($1) 
      RETURNING id, player1_id, player2_id, 
      game_status, hand_position_p1, hand_position_p2, 
      draw, win, lose, created_at, initialize_at, finish_at `,
      [userId]
    );
    const newRoom = roomResult.rows[0];
    return newRoom;
  } catch (err) {
    throw new Error("Something wrong happened");
  }
};

module.exports = { createRoom };
