const User = require("../models/User");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "Get users list successfully",
        data: { users },
      });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "Get User successfully",
        data: { user },
      });
  } catch (error) {
    next(error);
  }
};

exports.userProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { username, email, role },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(400).send("Error updating user");
  }
};

exports.updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { username, email },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(400).send("Error updating user");
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.send("User deleted");
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "Get User successfully",
        data: { user },
      });
  } catch (error) {
    next(error);
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
