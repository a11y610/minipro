import { motion } from "framer-motion"
import NeuralBackground from "../components/NeuralBackground"

function Contact() {
  return (
    <>
    <NeuralBackground/>
    <motion.div
      className="glass-page"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2>Contact Us</h2>

      <p>
        Have questions or suggestions? We'd love to hear from you.
      </p>

      <div style={{ marginTop: "30px", lineHeight: "1.8" }}>
        <p><strong>Email:</strong> support@3dviewerpro.com</p>
        <p><strong>Phone:</strong> +91 XXXXX XXXXX</p>
        <p><strong>Location:</strong> India</p>
      </div>
    </motion.div>
    </>
  )
}

export default Contact
