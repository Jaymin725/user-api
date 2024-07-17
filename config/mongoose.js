const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://jayminbhavsar07:jaymin123@cluster0.y9vc3gt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("connected to the database"));

module.exports = mongoose;
