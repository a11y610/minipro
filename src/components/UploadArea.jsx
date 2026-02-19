import { useRef } from "react"

function UploadArea({ onFileSelect }) {
  const inputRef = useRef()

  const handleFile = (file) => {
    if (!file) return

    const extension = file.name.split(".").pop().toLowerCase()

    if (extension === "gltf") {
      alert("Please upload .glb format instead of .gltf (single file required)")
      return
    }

    if (file.size > 30 * 1024 * 1024) {
      alert("File too large. Please upload under 30MB.")
      return
    }

    onFileSelect(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div
      className="upload-area"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => inputRef.current.click()}
    >
      <input
        type="file"
        ref={inputRef}
        hidden
        accept=".glb,.obj"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <h2>Drag & Drop Your 3D Model</h2>
      <p>Supported formats: GLB, OBJ</p>
    </div>
  )
}

export default UploadArea
