import { useState } from "react"
import { useNavigate } from "react-router-dom"

function FloorPlanUpload() {
  const [file, setFile] = useState(null)
  const navigate = useNavigate()

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file")
      return
    }

    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch("http://localhost:5000/upload-floorplan", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      console.log("API response:", data)

      // 👉 Send walls and mask URL to viewer page
      navigate("/floor-view", { state: { walls: data.walls, maskUrl: data.maskUrl } })

    } catch (error) {
      console.error("Upload error:", error)
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Floor Plan</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Generate 3D
      </button>
    </div>
  )
}

export default FloorPlanUpload