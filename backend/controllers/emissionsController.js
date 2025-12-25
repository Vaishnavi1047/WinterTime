const EmissionsLog = require("../models/EmissionsLog");
const { calculateEmissions } = require("../services/calculationService");

exports.createEmissionLog = async (req, res) => {
  const { year, electricityKwh, fuelLitres } = req.body;

  const totalEmissions = calculateEmissions({ electricityKwh, fuelLitres });

  const targetEmissions = totalEmissions * 0.97;

  const log = await EmissionsLog.create({
    userId: req.user?.id || null,
    year,
    electricityKwh,
    fuelLitres,
    totalEmissions,
    targetEmissions
  });

  res.json(log);
};
