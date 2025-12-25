const express = require("express");
const router = express.Router();
const { signup, login, updateUser } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.put("/update/:id", updateUser);
module.exports = router;