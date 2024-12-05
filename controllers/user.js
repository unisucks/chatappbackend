const userDB = require("../models/user");

const getUser = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUser = await userDB
      .find({ _id: { $ne: loggedInUser } })
      .select("-password");
    res.status(200).json(filteredUser);
  } catch (error) {
    console.log("Error in getuser controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getUser };
