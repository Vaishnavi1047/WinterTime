const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify the Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create them with DEFAULT ENTRIES
      // We generate a dummy password because the Schema requires one
      const dummyPassword = Math.random().toString(36).slice(-10); 
      
      user = new User({
        email,
        companyName: name, // Default to Google account name
        password: dummyPassword, 
        role: 'OBLIGATED_ENTITY', // Default
        sector: 'DEFAULT',        // Default
        complianceTarget2025: 0,  // Default
      });

      await user.save();
    }

    // Generate our app's JWT
    const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      token: appToken,
      user: userResponse
    });

  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ message: "Google Authentication failed. Please try again." });
  }
};