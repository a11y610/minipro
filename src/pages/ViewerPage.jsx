import { useState } from "react"
import UploadArea from "../components/UploadArea"
import Viewer from "../components/Viewer"

function ViewerPage() {
  const [fileUrl, setFileUrl] = useState(null)
  const [fileName, setFileName] = useState("")

  const handleFileSelect = (file) => {
    const url = URL.createObjectURL(file)
    setFileUrl(url)
    setFileName(file.name)
  }

  const resetViewer = () => {
    setFileUrl(null)
    setFileName("")
  }

  return (
    <>
      {!fileUrl && <UploadArea onFileSelect={handleFileSelect} />}
      {fileUrl && (
        <Viewer
          fileUrl={fileUrl}
          fileName={fileName}
          onReset={resetViewer}
        />
      )}
    </>
  )
}

export default ViewerPage
