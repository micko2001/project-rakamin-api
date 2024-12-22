const jwt = require("jsonwebtoken");

function generateAccessToken(username) {
  const TOKEN_SECRET = 'secret'
  return jwt.sign(username, TOKEN_SECRET, { expiresIn: "1800s" });
}

module.exports = { generateAccessToken };
