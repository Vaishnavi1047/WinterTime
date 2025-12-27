// Authentication middleware
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authenticate user and attach user to req
exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found." });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

// Require specific user role
exports.requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: `Access denied. Only ${role} allowed.` });
  }
  next();
};
