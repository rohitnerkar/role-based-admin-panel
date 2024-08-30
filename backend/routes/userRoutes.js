const express = require("express");
const {
  getAllUsers,
  updateUser,
  deleteUser,
  getUser,
} = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");
const { ensureAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", auth, getAllUsers);
router.put("/:id", auth, updateUser);
router.get("/:id", auth, getUser);
router.delete("/:id", auth, deleteUser);

router.get("/profile", ensureAuthenticated, (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

module.exports = router;
