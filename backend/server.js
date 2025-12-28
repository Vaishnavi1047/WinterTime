const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL
}));
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const emissionsRoutes = require("./routes/emissionsRoutes");
const sellRoutes = require("./routes/sellRoutes");
const adminRoutes = require("./routes/adminRoutes");
const newsRoutes = require('./routes/newsRoutes');
app.use("/api/auth", authRoutes);
app.use("/api/emissions", emissionsRoutes);
app.use("/api/sell", sellRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/news', newsRoutes);
app.get("/", (req, res) => {
  res.send("BEE Carbon Market API Running 🚀");
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});