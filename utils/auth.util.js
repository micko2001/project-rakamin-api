const jwt = require("jsonwebtoken");

function generateAccessToken(username) {
  // const TOKEN_SECRET = 'secret'
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "72h" });
}

module.exports = { generateAccessToken };
