const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createEmissionLog, getEmissionsHistory, getCurrentYearEmissions } = require("../controllers/emissionsController");

router.post("/log", auth, createEmissionLog);
router.get("/history", auth, getEmissionsHistory);
router.get("/current", auth, getCurrentYearEmissions);

module.exports = router;