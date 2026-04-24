import FloorPlanViewer from "../components/FloorPlanViewer"

const dummyWalls = [
  { x1: 0, y1: 0, x2: 200, y2: 0 },
  { x1: 200, y1: 0, x2: 200, y2: 150 },
  { x1: 200, y1: 150, x2: 0, y2: 150 },
  { x1: 0, y1: 150, x2: 0, y2: 0 }
]

function TestPage() {
  return <FloorPlanViewer walls={dummyWalls} />
}

export default TestPage