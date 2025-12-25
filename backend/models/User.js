const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["OBLIGATED_ENTITY", "OFFSET_DEVELOPER", "VERIFIER", "ADMIN"],
    default: "OBLIGATED_ENTITY"
  },
  sector: {
    type: String,
    enum: ["CEMENT", "STEEL", "POWER", "ALUMINUM", "DEFAULT"],
    default: "DEFAULT"
  },
  complianceTarget2025: { type: Number, default: 0 },
  isVerifiedSeller: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);