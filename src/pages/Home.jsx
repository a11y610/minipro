import { motion } from "framer-motion"
import { Link } from "react-router-dom"

function Home() {
  return (
    <motion.div
      className="hero"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Next-Gen 3D Model Platform
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Upload, inspect and interact with your 3D assets
        in real-time directly in your browser.
      </motion.p>

      <motion.div
        className="hero-buttons"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Link to="/viewer" className="primary-btn">
          Start Exploring
        </Link>

        <Link to="/about" className="secondary-btn">
          Learn More
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default Home
