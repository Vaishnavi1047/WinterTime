const express = require("express");
const router = express.Router();
const { createEmissionLog } = require("../controllers/emissionsController");

router.post("/log", createEmissionLog);

module.exports = router;
