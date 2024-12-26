const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "unauthenticated" });
  }

  const TOKEN_SECRET = 'secret'

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ error: "Token expired" });
      } else {
        return res.status(403).json({ error: "unauthorized" });
      }
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
