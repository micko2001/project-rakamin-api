const express = require("express");
const router = express.Router();

const userController = require("../controllers/users.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const userRepository = require('../repositories/users.repository')

router.post("/auth/register", userController.createUser);
router.post("/auth/login", userController.login);
router.get("/profile", authenticateToken, userController.getUserById);
router.get("/rank", userRepository.getRanks);

module.exports = router;
