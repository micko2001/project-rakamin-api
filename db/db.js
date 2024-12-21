const Pool = require("pg").Pool;

//setup for local
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "rakamin-project",
//   password: process.env.PASSWORD_DB,
//   port: 5432,
// });

//setup for vercel
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
