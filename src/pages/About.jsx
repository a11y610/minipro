import { motion } from "framer-motion"
import NeuralBackground from "../components/NeuralBackground"

function About() {
  return (
    <>
      <NeuralBackground />
      <motion.div
        className="glass-page"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
    >
      <h2>About 3D Viewer Pro</h2>

      <p>
        3D Viewer Pro is a modern WebGL-based platform built
        using React and Three.js. It enables real-time rendering,
        animation playback, inspection and interaction with 3D models.
      </p>

      <p>
        Designed with performance and user experience in mind,
        it supports GLB and OBJ formats with smooth controls,
        auto-scaling, environment lighting and animation handling.
      </p>

      <p>
        This project demonstrates advanced front-end engineering,
        real-time graphics handling and modern SaaS UI design.
      </p>
    </motion.div>
    </>
  )
}

export default About
