import { useLocation } from "react-router-dom"
import FloorPlanViewer from "../components/FloorPlanViewer"
import TerminalLogs from "../components/TerminalLogs"

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

function FloorView() {
  const location = useLocation()
  const walls = location.state?.walls || []
  const maskUrl = location.state?.maskUrl || null

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "#0d0d0d",
        color: "#e0e0e0",
        overflow: "hidden",
      }}
    >
      {/* ── Left Panel: Processing Info ── */}
      <div
        style={{
          width: "360px",
          minWidth: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "20px",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          overflowY: "auto",
          background: "rgba(10,10,20,0.85)",
          backdropFilter: "blur(8px)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "16px",
            letterSpacing: "0.08em",
            color: "#00ff8c",
            textTransform: "uppercase",
          }}
        >
          Processing Pipeline
        </h2>

        {/* Mask image */}
        <div>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "11px",
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Intermediate Mask
          </p>
          <div
            style={{
              border: "1px solid rgba(0,255,140,0.25)",
              borderRadius: "6px",
              overflow: "hidden",
              background: "#111",
            }}
          >
            {maskUrl ? (
              <img
                src={`${BACKEND}${maskUrl}`}
                alt="Intermediate CV mask"
                style={{ width: "100%", display: "block" }}
              />
            ) : (
              <div
                style={{
                  height: "160px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#444",
                  fontSize: "13px",
                }}
              >
                No mask available
              </div>
            )}
          </div>
        </div>

        {/* Terminal logs */}
        <div>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "11px",
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Processing Logs
          </p>
          <TerminalLogs />
        </div>
      </div>

      {/* ── Right Panel: 3D Viewer ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <FloorPlanViewer walls={walls} />
      </div>
    </div>
  )
}

export default FloorView