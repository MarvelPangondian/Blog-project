const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
require("dotenv").config();

const showUsage = () => {
  console.log("Usage: npm run create-user <username> <password>");
  process.exit(1);
};

const cerateUser = async () => {
  try {

    const args = process.argv.slice(2);
    if (args.length !== 2) {
      showUsage();
    }
    const [userName, password] = args;

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("successfully connected !");

    // find userName
    if (await User.findOne({ username: userName })) {
      console.log("username is not unique");
      process.exit(1);
    }

    // password length
    if (password.length < 8) {
      console.log("Password is too short");
      process.exit(1);
    }
    
    const newPassword = await bcrypt.hash(password, 10);

    await User.insertMany([
      {
        username: userName,
        password: newPassword,
      },
    ]);

    console.log("success !");
    mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
};

cerateUser();
