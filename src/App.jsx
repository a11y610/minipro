import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import ViewerPage from "./pages/ViewerPage"
import About from "./pages/About"
import Contact from "./pages/Contact"

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
        </Routes>
      </div>
    </div>
  )
}

export default App
