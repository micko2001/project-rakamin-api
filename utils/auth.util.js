const jwt = require("jsonwebtoken");

function generateAccessToken(username) {
  const TOKEN_SECRET = 'secret'
  return jwt.sign(username, TOKEN_SECRET, { expiresIn: "72h" });
}

module.exports = { generateAccessToken };
