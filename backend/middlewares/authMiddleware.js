const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  try {
    const authorization =
      req.headers.authorization && req.headers.authorization.split(" ");
    const token = authorization.length > 1 ? authorization[1] : null;

    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      if (Date.now() >= payload.exp * 1000) {
        return res.status(401).json({ message: "Token expired" });
      }

      if (!payload._id) {
        return res
          .status(400)
          .json({ message: "Invalid token payload, missing user ID" });
      }

      req.user = {
        _id: payload._id,
        username: payload.username,
        email: payload.email,
        role: payload.role,
      };

      next();
    } else {
      return res.status(400).json({ message: "Token is required" });
    }
  } catch (error) {
    return res
      .status(401)
      .json({
        message: "Session expired. Please log in again.",
        error: error.message,
      });
  }
};

module.exports = isAuth;

module.exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
