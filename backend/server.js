const express = require("express")
const multer = require("multer")
const cors = require("cors")
const { exec } = require("child_process")
const path = require("path")
const fs = require("fs")

const app = express()

app.use(cors())
app.use(express.json())

// -------------------------------
// Multer Storage Config
// -------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const upload = multer({ storage: storage })

// -------------------------------
// Basic Routes
// -------------------------------
app.get("/", (req, res) => {
  res.send("3D Viewer backend running 🚀")
})

// -------------------------------
// ✅ NEW ROUTE: FLOOR PLAN UPLOAD
// -------------------------------
app.post("/upload-floorplan", upload.single("image"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" })
  }

  const imagePath = req.file.path

  console.log("Blueprint uploaded:", imagePath)

  // Run Python script
  const pythonScript = path.join(__dirname, "processing", "floorplan_to_json.py")

  exec(`python ${pythonScript} ${imagePath}`, (error, stdout, stderr) => {

    if (error) {
      console.error("Python error:", error)
      return res.status(500).json({ error: "Processing failed" })
    }

    try {
      const result = JSON.parse(stdout)

      res.json({
        message: "Processing successful",
        walls: result
      })

    } catch (err) {
      console.error("JSON parse error:", err)
      res.status(500).json({ error: "Invalid JSON from Python" })
    }
  })
})

// -------------------------------
// Start Server
// -------------------------------
app.listen(5000, () => {
  console.log("Server running on port 5000")
})