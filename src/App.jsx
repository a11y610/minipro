import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import ViewerPage from "./pages/ViewerPage"
import About from "./pages/About"
import Contact from "./pages/Contact"
import TestPage from "./pages/TestPage"
import FloorPlanUpload from "./pages/FloorPlanUpload"
import FloorView from "./pages/FloorView"

function App() {
  return (
    <div className="app-container">
      <Navbar />

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/viewer" element={<ViewerPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/floor-upload" element={<FloorPlanUpload />} />
          <Route path="/floor-view" element={<FloorView />} />
        </Routes>
      </div>
    </div>
  )
}

export default App