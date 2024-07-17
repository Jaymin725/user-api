const express = require("express");
const passport = require("./config/passport");
const users = require("./routes/users");

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(passport.initialize());

app.use("/api/users", users);

app.listen(port, () => console.log("http://localhost:" + 3000));
