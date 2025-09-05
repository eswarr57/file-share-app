const mongoose = require("mongoose");

// Replace with your MongoDB Atlas connection string
const MONGO_URI = "mongodb+srv://kaligatlaeswarr_db_user:SPhvMMrWeBuWvlIs@cluster0.k4l51pg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

module.exports = mongoose;
