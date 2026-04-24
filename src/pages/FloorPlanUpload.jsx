import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

function FloorPlanUpload() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file")
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch(`${BACKEND}/upload-floorplan`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Processing failed. Please try again.")
        setLoading(false)
        return
      }

      console.log("API response:", data)

      navigate("/floor-view", { state: { walls: data.walls, maskUrl: data.maskUrl } })
    } catch (err) {
      console.error("Upload error:", err)
      setError("Could not reach the server. Make sure the backend is running.")
      setLoading(false)
    }
  }

  return (
    <div className="upload-area" style={{ margin: "40px", cursor: "default" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          padding: "40px",
          width: "100%",
          maxWidth: "480px",
        }}
      >
        <h2 style={{ margin: 0 }}>Floor Plan 3D</h2>
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "15px", textAlign: "center" }}>
          Upload a floor plan blueprint image and we'll generate an interactive 3D model.
        </p>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            padding: "24px 32px",
            border: "2px dashed rgba(124, 58, 237, 0.5)",
            borderRadius: "14px",
            cursor: "pointer",
            width: "100%",
            boxSizing: "border-box",
            background: "rgba(255,255,255,0.03)",
            transition: "border-color 0.2s",
          }}
        >
          <span style={{ fontSize: "32px" }}>🏗️</span>
          <span style={{ color: "#cbd5e1", fontSize: "14px" }}>
            {file ? file.name : "Click to choose an image"}
          </span>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              setFile(e.target.files[0])
              setError(null)
            }}
          />
        </label>

        {error && (
          <p
            style={{
              margin: 0,
              color: "#f87171",
              fontSize: "13px",
              textAlign: "center",
              background: "rgba(248,113,113,0.1)",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid rgba(248,113,113,0.3)",
            }}
          >
            ⚠️ {error}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="primary-btn"
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "15px",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing…" : "Generate 3D Model"}
        </button>
      </motion.div>
    </div>
  )
}

export default FloorPlanUpload