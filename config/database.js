const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("DATABASE CONNECTED SUCCESSFULLY"))
    .catch((error) => {
      console.log("DATABASE CONNECTION FAILED!");
      console.error(error);
      process.exit(1);
    });
};
