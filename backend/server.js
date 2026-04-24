const express = require("express")
const multer = require("multer")
const cors = require("cors")
const { execFile } = require("child_process")
const path = require("path")
const fs = require("fs")

const app = express()

app.use(cors())
app.use(express.json())

// Serve uploaded files (including mask images) as static assets
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

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
  // Derive a stable base name from the uploaded filename (no extension)
  const baseName = path.basename(req.file.filename, path.extname(req.file.filename))

  console.log("Blueprint uploaded:", imagePath)

  // Run Python script — use execFile to avoid shell injection
  const pythonScript = path.join(__dirname, "processing", "floorplan_to_json.py")

  // Try python3 first (standard on Linux/Mac), fall back to python (Windows / some envs)
  const tryExec = (executables, args, callback) => {
    if (executables.length === 0) {
      return callback(new Error("No Python executable found (tried python3, python)"))
    }
    const exe = executables[0]
    const rest = executables.slice(1)
    execFile(exe, args, (error, stdout, stderr) => {
      if (error && rest.length > 0) {
        return tryExec(rest, args, callback)
      }
      callback(error, stdout, stderr)
    })
  }

  tryExec(["python3", "python"], [pythonScript, imagePath, baseName], (error, stdout, stderr) => {

    if (error) {
      console.error("Python error:", error)
      if (stderr) console.error("Python stderr:", stderr)
      return res.status(500).json({ error: "Processing failed", detail: error.message })
    }

    try {
      const result = JSON.parse(stdout)

      res.json({
        message: "Processing successful",
        walls: result.walls,
        maskUrl: `/uploads/${result.maskFile}`
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