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
  const { email, name, password, avatar } = user;

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

const getRanks = (req, res) => {
  pool.query(
    `
    with count_win as (
      SELECT win, count(win) as count_win
      FROM rooms
      GROUP BY win
    )

    SELECT 
      name, avatar, point, count_win
    FROM users a
    LEFT JOIN count_win b
    on a.id = b.win
    ORDER BY point DESC
    LIMIT 10
    `, 
    (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  })
};

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  getRanks
};
