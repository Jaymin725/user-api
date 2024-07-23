const express = require("express");
const passport = require("passport");

const User = require("../models/User");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  deleteUser,
  updateUser,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/", registerUser);

router.post("/login", loginUser);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getCurrentUser
);

router.put("/", passport.authenticate("jwt", { session: false }), updateUser);

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  deleteUser
);

module.exports = router;
