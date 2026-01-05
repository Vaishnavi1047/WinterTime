const express = require("express");
const router = express.Router();
const { signup, login, updateUser, googleLogin } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.put("/update/:id", updateUser);
module.exports = router;