const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error in registration", details: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 401;
      throw new Error("Invalid Credentials");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.code = 401;
      throw new Error("Invalid Credentials");
    }

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "User signin successfully",
        data: { token, user },
      });
  } catch (error) {
    next(error);
  }
};

exports.currentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      return res
        .status(404)
        .json({ code: 404, status: false, message: "User not found" });
    }

    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "Get current user successfully",
        data: { user },
      });
  } catch (error) {
    console.error("Error in currentUser:", error.message);
    res
      .status(500)
      .json({
        code: 500,
        status: false,
        message: "Internal Server Error",
        error: error.message,
      });
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { username, email } = req.body;

    const user = await User.findById(_id).select("-password -role");
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    if (email) {
      const isUserExist = await User.findOne({ email });
      if (
        isUserExist &&
        isUserExist.email === email &&
        String(user._id) !== String(isUserExist._id)
      ) {
        res.code = 400;
        throw new Error("Email already exist");
      }
    }

    user.username = username ? username : user.username;
    user.email = email ? email : user.email;

    await user.save();

    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "User profile updated successfully",
        data: { user },
      });
  } catch (error) {
    next(error);
  }
};
