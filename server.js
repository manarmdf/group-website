

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/visionBoardDB")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));


// Define Schema
const imageSchema = new mongoose.Schema({
    filename: String, // Store only the filename
});
const Image = mongoose.model("Image", imageSchema);

// Set EJS as view engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // Serve uploaded images
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Allow JSON requests

// Multer setup for saving images to `uploads/` folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save to `uploads/` directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});
const upload = multer({ storage: storage });

// Home Route - Fetch and Display Images
app.get("/", async (req, res) => {
    try {
        const images = await Image.find();
        
        // Define a static frames array
        const frames = [
            { size: "large" },
            { size: "medium" },
            { size: "small" },
            { size: "large" }
        ];

        res.render("index", { images, frames }); // ✅ Pass frames to EJS
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching images");
    }
});


// Upload Image Route
app.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded.");

    // Save the filename in MongoDB
    const newImage = new Image({ filename: req.file.filename });
    await newImage.save();

    res.redirect("/");
});

// Start Server
app.listen(3000, () => console.log("🚀 Server running on port 3000"));
