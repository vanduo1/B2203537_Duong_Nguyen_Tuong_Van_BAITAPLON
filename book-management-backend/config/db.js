const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/book-management";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

module.exports = { client, connectDB };
