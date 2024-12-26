const pool = require("../db/db");

const findUserById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT email, id, name, point, avatar
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
const findUserByUsername = async (username) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM users
       WHERE users.username = $1`,
      [username]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

const createUser = async (user) => {
  const { email, name, password, avatar } = user;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const userResult = await client.query(
      `INSERT INTO users (email, name, password, avatar) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, name, avatar`,
      [
        email,
        name,
        password,
        avatar,
      ]
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

const getTopUsers = async () => {
  return pool.query(
    ` with count_win as
     ( SELECT win, count(win) 
      as count_win FROM rooms 
      GROUP BY win ) SELECT name,
       avatar, point, count_win 
       FROM users a LEFT JOIN 
       count_win b on a.id = b.win 
       ORDER BY point DESC LIMIT 10 `
  );
};

const getHistory = async (userId) => {
  const query = `
      SELECT 
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
      WHERE (r.player1_id = $1 OR r.player2_id = $1) AND r.game_status = 'finished'
      ORDER BY r.created_at DESC 
      LIMIT 10;
  `;
  const values = [userId];
  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching game history:", error);
    throw new Error("Could not fetch game history");
  }
};

const playAgain = async (rooms) => {
  try {
    const query = await pool.query(
      `INSERT INTO rooms (
          player1_id,
          game_status) 
      VALUES ($1, 'waiting')
      RETURNING id, player1_id, game_status, created_at;`,
      [rooms]
    );
    const result = await pool.query(query, [rooms]);
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong.");
  }
};

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  findUserByUsername,
  getTopUsers,
  getHistory,
  playAgain,
};
