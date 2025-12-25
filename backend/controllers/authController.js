const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- SIGNUP LOGIC ---
exports.signup = async (req, res) => {
  try {
    const { email, password, companyName, role, sector, complianceTarget2025 } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      password: hashedPassword,
      companyName,
      role,
      sector: sector || "DEFAULT",
      complianceTarget2025: Number(complianceTarget2025) || 0
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      token,
      user: userResponse
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// --- LOGIN LOGIC ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      token,
      user: userResponse
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
};

// --- UPDATE USER LOGIC ---
exports.updateUser = async (req, res) => {
  try {
    const { companyName, role, sector, complianceTarget2025 } = req.body;
    const userId = req.params.id;


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          companyName, 
          role, 
          sector, 
          complianceTarget2025: Number(complianceTarget2025) 
        } 
      },
      { new: true, runValidators: true } 
    ).select("-password"); 

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Error updating account settings." });
  }
};