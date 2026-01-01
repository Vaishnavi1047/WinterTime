const express = require("express");
const mongoose = require("mongoose");
const OpenAI = require("openai");
const EmissionsLog = require("../models/EmissionsLog");
const User = require("../models/User");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//Building a overview of user's emissions data for context
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

const advisorLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
});

router.post("/advisor", advisorLimiter, async (req, res) => {
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // cheap & fast
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const reply =
      completion.choices[0].message.content ||
      "I couldn’t generate a response at the moment.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Carbon Advisor error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

module.exports = router;
