const express = require("express");
const {
  register,
  login,
  currentUser,
  updateProfile,
} = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");
const {
  signupValidator,
  signinValidator,
  updateProfileValidator,
} = require("../validators/auth");
const validate = require("../validators/validate");

const router = express.Router();

router.post("/register", signupValidator, validate, register);
router.post("/login", signinValidator, validate, login);
router.get("/current-user", auth, currentUser);
router.put("/update-profile", auth, updateProfileValidator, validate, updateProfile);

module.exports = router;
