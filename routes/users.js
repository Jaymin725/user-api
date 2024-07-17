const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user)
    return res
      .status(400)
      .json({ error: true, message: "Email already exists" });

  const newUser = new User({ name, email, password });

  try {
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ error: true, message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    const payload = { id: user.id, name: user.name };

    jwt.sign(payload, "secret", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ success: true, token: `Bearer ${token}` });
    });
  } else {
    return res.status(400).json({ error: true, message: "Password incorrect" });
  }
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
  }
);

module.exports = router;
