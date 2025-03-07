const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB...");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
  }
};

module.exports = connectdb;
