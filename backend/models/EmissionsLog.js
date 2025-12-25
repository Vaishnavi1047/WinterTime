const mongoose = require("mongoose");

const EmissionsLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: Number, default: 2025 },
  inputs: {
    electricityGrid: { type: Number, default: 0 },
    coalThermal: { type: Number, default: 0 },
    diesel: { type: Number, default: 0 }
  },
  calculatedEmissions: { type: Number, required: true },
  targetEmissions: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("EmissionsLog", EmissionsLogSchema);