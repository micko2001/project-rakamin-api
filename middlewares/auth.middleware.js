const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "unauthenticated" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "unauthorized" });
    }

    // const currentTime = Math.floor(Date.now()/1000)
    // const expBuffer = 3*60
    // if (user.exp - currentTime <= expBuffer) {
    //   const newToken = jwt.sign(
    //     {id: user.id, name: user.name},
    //     process.env,TOKEN_SECRET,
    //     {expiredIn: "3d"}
    //   )
    //   res.setHeader("New-JWT-token", newToken)
    // }
    req.user = user;

    next();
  });
}

module.exports = authenticateToken;
