const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("successfully connected !");
  } catch (err) {
    console.log(err);
  }
};

process.on("SIGINT", () => {
  mongoose.connection.close();
  console.log("Received SIGINT. Exiting...");
  process.exit(0);
});

process.on("SIGTERM", () => { 
  mongoose.connection.close();
  console.log("Received SIGTERM. Exiting...");
  process.exit(0);
});

// module.exports = {connectToDatabase}
connectToDatabase();
