const express = require("express");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const EmissionsLog = require("../models/EmissionsLog");
const User = require("../models/User");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Build context from user's emissions log
function buildEmissionsContext(user, log) {
  if (!log) {
    return `
Company: ${user.companyName}
Sector: ${user.sector}
No emissions data submitted yet.
`;
  }

  const gap = log.calculatedEmissions - log.targetEmissions;

  return `
Company: ${user.companyName}
Sector: ${user.sector}
Compliance Target 2025: ${user.complianceTarget2025} tCO2e

Latest Emissions (${log.year}):
- Electricity Grid: ${log.inputs.electricityGrid}
- Coal Thermal: ${log.inputs.coalThermal}
- Diesel: ${log.inputs.diesel}

Total Emissions: ${log.calculatedEmissions} tCO2e
Target Emissions: ${log.targetEmissions} tCO2e
Gap: ${gap > 0 ? `${gap} tCO2e above target` : "Within target"}
`;
}

// Advisor route
router.post("/advisor", async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ error: "Message and userId are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const recentLog = await EmissionsLog.findOne({ userId }).sort({ year: -1 });

    const prompt = `
You are an expert AI Carbon Advisor for Indian industries.

Your role:
- Analyze emissions data
- Identify major emission drivers
- Suggest practical reduction strategies
- Tailor advice strictly to the user's sector
- Focus on electricity, coal, and diesel usage
- Avoid generic sustainability advice

${buildEmissionsContext(user, recentLog)}

User Question:
"${message}"

Respond clearly with:
1️⃣ Main emission drivers
2️⃣ 2–3 actionable reduction steps
3️⃣ Expected qualitative impact
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    const reply = result?.response?.text() || "I couldn’t generate a response at the moment.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Carbon Advisor error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;
