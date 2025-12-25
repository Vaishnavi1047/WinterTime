const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["OBLIGATED_ENTITY", "OFFSET_DEVELOPER", "VERIFIER", "ADMIN"]
  },
  isVerifiedSeller: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
