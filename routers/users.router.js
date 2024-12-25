const express = require("express");
const router = express.Router();

const userController = require("../controllers/users.controller");
const roomController = require("../controllers/rooms.controller");
const authenticateToken = require("../middlewares/auth.middleware");

router.post("/auth/register", userController.createUser);
router.post("/auth/login", userController.login);
router.get("/profile", authenticateToken, userController.getUserById);
router.get("/leaderboards", authenticateToken, userController.leaderboards);
router.get("/history", authenticateToken, userController.getHistory);

module.exports = router;
