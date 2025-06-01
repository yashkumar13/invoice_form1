// connectDB.js (CommonJS)
require('dotenv').config();

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            process.env.DB);
        console.log("\n MongoDB connected!!");
    } catch (error) {
        console.error("MongoDB Connection FAILED", error);
        process.exit(1);
    }
};

module.exports = { connectDB };
