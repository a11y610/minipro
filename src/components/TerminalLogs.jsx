import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const MotionDiv = motion.div

const LOG_LINES = [
  "$ Initializing CV engine...",
  "$ Loading image into memory...",
  "$ Converting to grayscale...",
  "$ Applying binary threshold (200)...",
  "$ Morphological close — kernel 7×7...",
  "$ Dilating walls — 2 iterations...",
  "$ Saving intermediate mask...",
  "$ Detecting external contours...",
  "$ Filtering noise (area < 5000px)...",
  "$ Building bounding rectangles...",
  "$ Generating wall segments...",
  "$ Serializing JSON output...",
  "$ Constructing 3D geometry...",
  "$ Scene ready ✔",
]

const LINE_INTERVAL_MS = 400

function TerminalLogs() {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (visibleCount >= LOG_LINES.length) return
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), LINE_INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [visibleCount])

  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.85)",
        border: "1px solid rgba(0, 255, 140, 0.35)",
        borderRadius: "8px",
        padding: "16px",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "13px",
        color: "#00ff8c",
        minHeight: "220px",
        overflowY: "auto",
        backdropFilter: "blur(6px)",
      }}
    >
      <div style={{ color: "#888", marginBottom: "8px", fontSize: "11px" }}>
        ── floorplan_to_json.py ──
      </div>
      <AnimatePresence>
        {LOG_LINES.slice(0, visibleCount).map((line, i) => (
          <MotionDiv
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            style={{ marginBottom: "4px", whiteSpace: "pre" }}
          >
            {line}
          </MotionDiv>
        ))}
      </AnimatePresence>
      {visibleCount < LOG_LINES.length && (
        <span className="terminal-cursor" />
      )}
    </div>
  )
}

export default TerminalLogs
