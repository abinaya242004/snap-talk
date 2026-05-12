const express = require("express");

const {
  registerUser,
  loginUser,
  verifyPassword,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();//handels routes

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/verify-password", protect, verifyPassword);

module.exports = router;