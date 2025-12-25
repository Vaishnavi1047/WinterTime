const mongoose = require("mongoose");

const EmissionsLogSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  year: Number,
  electricityKwh: Number,
  fuelLitres: Number,
  totalEmissions: Number,
  targetEmissions: Number
}, { timestamps: true });

module.exports = mongoose.model("EmissionsLog", EmissionsLogSchema);
