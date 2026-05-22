import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

// ── constants ──────────────────────────────────────────────────────────────────
const WORLD_SIZE   = 500   // the floor plan maps to a 500×500 unit world
const WALL_HEIGHT  = 40    // 3-D height of each wall segment (units)
const WALL_THICK   = 8     // wall thickness (units) – thin but visible

function FloorPlanViewer({ walls = [] }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const width  = el.clientWidth  || window.innerWidth
    const height = el.clientHeight || window.innerHeight

    // ── Scene ─────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111111)
    scene.fog = new THREE.Fog(0x111111, 800, 2000)

    // ── Camera ────────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 5000)
    camera.position.set(WORLD_SIZE * 0.8, WORLD_SIZE * 1.2, WORLD_SIZE * 0.8)
    camera.lookAt(WORLD_SIZE / 2, 0, WORLD_SIZE / 2)

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    el.appendChild(renderer.domElement)

    // ── Controls ──────────────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(WORLD_SIZE / 2, 0, WORLD_SIZE / 2)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 50
    controls.maxDistance = 2000
    controls.update()

    // ── Lighting ──────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambient)

    const sun = new THREE.DirectionalLight(0xffffff, 1.2)
    sun.position.set(400, 600, 300)
    sun.castShadow = true
    scene.add(sun)

    const fillLight = new THREE.PointLight(0x7c3aed, 0.6, 1200)
    fillLight.position.set(WORLD_SIZE / 2, 200, WORLD_SIZE / 2)
    scene.add(fillLight)

    // ── Grid / Floor ──────────────────────────────────────────────────────────
    const gridHelper = new THREE.GridHelper(WORLD_SIZE * 1.5, 30, 0x333333, 0x222222)
    gridHelper.position.set(WORLD_SIZE / 2, 0, WORLD_SIZE / 2)
    scene.add(gridHelper)

    const floorGeo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.9,
      metalness: 0.1,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(WORLD_SIZE / 2, -0.5, WORLD_SIZE / 2)
    floor.receiveShadow = true
    scene.add(floor)

    // ── Wall material ─────────────────────────────────────────────────────────
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      roughness: 0.45,
      metalness: 0.3,
      emissive: 0x2a0a5e,
      emissiveIntensity: 0.3,
    })

    // ── Build wall meshes ─────────────────────────────────────────────────────
    console.log(`[FloorPlanViewer] rendering ${walls.length} wall segments`)

    walls.forEach((wall) => {
      const { x1, y1, x2, y2 } = wall

      // Convert normalised (0-1) coords → world space
      // Image Y axis points down; Three.js Z axis points toward viewer → flip Y
      const wx1 = x1 * WORLD_SIZE
      const wz1 = y1 * WORLD_SIZE   // image Y → world Z
      const wx2 = x2 * WORLD_SIZE
      const wz2 = y2 * WORLD_SIZE

      const dx     = wx2 - wx1
      const dz     = wz2 - wz1
      const length = Math.sqrt(dx * dx + dz * dz)

      if (length < 1) return   // skip degenerate segments

      const geo  = new THREE.BoxGeometry(length, WALL_HEIGHT, WALL_THICK)
      const mesh = new THREE.Mesh(geo, wallMat)

      // Centre of the wall segment
      mesh.position.set(
        (wx1 + wx2) / 2,
        WALL_HEIGHT / 2,
        (wz1 + wz2) / 2
      )

      // Rotate to align with the wall direction
      mesh.rotation.y = -Math.atan2(dz, dx)

      mesh.castShadow    = true
      mesh.receiveShadow = true
      scene.add(mesh)
    })

    // If no walls at all, show placeholder text in console
    if (walls.length === 0) {
      console.warn("[FloorPlanViewer] No walls received — check backend response")
    }

    // ── Handle window resize ──────────────────────────────────────────────────
    const onResize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", onResize)

    // ── Render loop ───────────────────────────────────────────────────────────
    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", onResize)
      controls.dispose()
      renderer.dispose()
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement)
      }
    }
  }, [walls])

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%", background: "#111" }}
    />
  )
}

export default FloorPlanViewer