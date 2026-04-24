import { useLocation } from "react-router-dom"
import FloorPlanViewer from "../components/FloorPlanViewer"

function FloorView() {
  const location = useLocation()
  const walls = location.state?.walls || []

  return <FloorPlanViewer walls={walls} />
}

export default FloorView