import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <img src="/favicon.png" alt="logo" className="logo" />
        <span className="brand-title">3D Viewer Pro</span>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/viewer">Upload</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  )
}

export default Navbar