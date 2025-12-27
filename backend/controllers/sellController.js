const CreditListing = require("../models/CreditListing");
const User = require("../models/User");

exports.sellCredits = async (req, res) => {
  try {
    const userId = req.user.id;
    const { credits, pricePerCredit, projectType } = req.body;

    //console.log("Sell Credits Request by User ID:", userId);
    const user = await User.findById(userId);
    if (!user || user.role !== "OFFSET_DEVELOPER") {
      return res.status(403).json({ message: "Only OFFSET_DEVELOPER can sell credits." });
    }

    const listing = await CreditListing.create({
      developerId: userId,
      credits,
      pricePerCredit,
      projectType,
      status: "PENDING"
    });
    //console.log("Credits listed for sale:", listing);   
    res.status(201).json({ message: "Credits listed for sale.", listing });
  } catch (err) {
    console.error("Sell Credits Error:", err);
    res.status(500).json({ message: "Server error during credit sale." });
  }
};
