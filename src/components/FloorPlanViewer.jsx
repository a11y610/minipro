import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

function FloorPlanViewer({ walls = [] }) {
  const mountRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xeeeeee)

    const width = mountRef.current.clientWidth || window.innerWidth
    const height = mountRef.current.clientHeight || window.innerHeight

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000)
    camera.position.set(300, 300, 300)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    mountRef.current.appendChild(renderer.domElement)

    // 🎮 Controls (NEW)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // 🌞 Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(100, 200, 100)
    scene.add(directionalLight)

    // 🧭 Axes
    const axesHelper = new THREE.AxesHelper(200)
    scene.add(axesHelper)

    // 🧱 Floor
    const floorGeometry = new THREE.PlaneGeometry(500, 500)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    scene.add(floor)

    // 🧱 Walls
    const material = new THREE.MeshStandardMaterial({
      color: 0x555555
    })

    console.log("Walls:", walls)

    walls.forEach((wall) => {
      const { x1, y1, x2, y2 } = wall

      const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

      const geometry = new THREE.BoxGeometry(length * 2, 80, 10)
      const mesh = new THREE.Mesh(geometry, material)

      const midX = (x1 + x2) / 2
      const midY = (y1 + y2) / 2

      mesh.position.set(midX, 40, midY)

      const angle = Math.atan2(y2 - y1, x2 - x1)
      mesh.rotation.y = -angle

      scene.add(mesh)
    })

    // 🎥 Render loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update() // IMPORTANT
      renderer.render(scene, camera)
    }
    animate()

    // 🧹 Cleanup
    return () => {
      if (renderer) renderer.dispose()

      if (
        mountRef.current &&
        renderer.domElement &&
        mountRef.current.contains(renderer.domElement)
      ) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [walls])

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />
}

export default FloorPlanViewer