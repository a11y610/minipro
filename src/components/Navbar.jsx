import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="navbar">
      <h2>3D Viewer Pro</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/Viewer">Upload</Link>
        <Link to="/About">About</Link>
        <Link to="/Contact">Contact</Link>
      </div>
    </nav>
  )
}

export default Navbar
