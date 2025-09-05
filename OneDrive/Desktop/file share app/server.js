const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Mongo Schema
const fileSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  url: String,
  uploadDate: { type: Date, default: Date.now }
});
const File = mongoose.model("File", fileSchema);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Serve frontend
app.use(express.static("public"));

// Upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  const fileUrl = `${req.protocol}://${req.get("host")}/download/${req.file.filename}`;

  const newFile = new File({
    filename: req.file.filename,
    originalName: req.file.originalname,
    url: fileUrl
  });
  await newFile.save();

  res.json({ fileUrl });
});

// Download route
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send("File not found.");
  }
});

// Optional: view all files metadata
app.get("/files", async (req, res) => {
  const files = await File.find().sort({ uploadDate: -1 });
  res.json(files);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
