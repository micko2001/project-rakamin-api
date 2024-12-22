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
  const { email, name, password, avatar, point } = user;

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

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
};
