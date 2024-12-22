const pool = require("../db/db");

const findUserById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM users
       WHERE users.id = $1`,
      [id]
    );

    return result.rows[0];
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

const findUserByEmail = async (email) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM users
       WHERE users.email = $1`,
      [email]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

const createUser = async (user) => {
  const { email, username, name, password, avatar, point } = user;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const userResult = await client.query(
      `INSERT INTO users (email, name, password, avatar) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, name, avatar`,
      [email, name, password, avatar]
    );
    const newUser = userResult.rows[0];

    await client.query("COMMIT");

    return {
      ...newUser,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error("Database error occurred while creating the user.");
  } finally {
    client.release();
  }
};

const getHistory = async (id) => {
  try {
    const result = await pool.query(
      `SELECT 
        r.id,
        r.player1_id,
        u1.name AS player1_name,
        u1.avatar AS player1_avatar,
        r.player2_id,
        u2.name AS player2_name,
        u2.avatar AS player2_avatar,
        r.win,
        r.lose,
        r.draw
      FROM rooms r
      LEFT JOIN users u1 ON r.player1_id = u1.id
      LEFT JOIN users u2 ON r.player2_id = u2.id
      WHERE r.player1_id = $1 OR r.player2_id = $1 AND r.game_status = 'finished'
      ORDER BY r.created_at DESC 
      LIMIT 10;`,
      [id]
    );
    return result.rows
  } catch (error) {
    console.error(error)
    throw new Error("Something went wrong while fetching history.");
  }
};


module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  getHistory,
};
