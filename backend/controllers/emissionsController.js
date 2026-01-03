const EmissionsLog = require("../models/EmissionsLog");
const User = require("../models/User");
const { calculateEmissions } = require("../services/calculationService");

exports.createEmissionLog = async (req, res) => {
  try {
    const { inputs, year } = req.body;
    const userId = req.user.id; 

    const totalEmissions = calculateEmissions(inputs);
    const user = await User.findById(userId);

    const log = await EmissionsLog.create({
      userId,
      year: year || 2025,
      inputs,
      calculatedEmissions: totalEmissions,
      targetEmissions: user.complianceTarget2025 || 51000
    });

    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: "Error saving data" });
  }
};

exports.getEmissionsHistory = async (req, res) => {
  try {
    const logs = await EmissionsLog.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

exports.getCurrentYearEmissions = async (req, res) => {
  try {
    const userId = req.user.id;       // from JWT middleware
    const year = Number(req.query.year) || 2025;
    //console.log('Fetching current year emissions for user:', userId, 'year:', year);
    const log = await EmissionsLog.findOne({ userId})
    //console.log('Found log:', log);
    if (!log) {
      return res.json({
        year,
        calculatedEmissions: 0,
        targetEmissions: 51000,
        inputs: {}
      });
    }

    res.json({
      year: log.year,
      calculatedEmissions: log.calculatedEmissions,
      targetEmissions: log.targetEmissions,
      inputs: log.inputs
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch emissions" });
  }
};