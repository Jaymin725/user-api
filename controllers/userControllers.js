const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

async function registerUser(req, res) {
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
}

async function loginUser(req, res) {
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
}

async function deleteUser(req, res) {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: true, message: "Server error" });
  }
}

function getCurrentUser(req, res) {
  res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
}

async function updateUser(req, res) {
  const { name, email, password } = req.body;

  try {
    await User.findByIdAndUpdate(req.user.id, { name, email, password });

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: true, message: "Server error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  deleteUser,
  updateUser,
};
