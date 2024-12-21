const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "rakamin-project",
  password: process.env.PASSWORD_DB,
  port: 5432,
});

module.exports = pool;
