import { Canvas, useLoader } from "@react-three/fiber"
import {
  OrbitControls,
  useGLTF,
  Environment,
  Html,
  useProgress,
  useAnimations,
} from "@react-three/drei"
import { OBJLoader } from "three-stdlib"
import { Suspense, useEffect, useState, useRef } from "react"
import * as THREE from "three"

/* ---------------- LOADER ---------------- */

function Loader() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div className="loader">
        Loading... {progress.toFixed(0)}%
      </div>
    </Html>
  )
}

/* ---------------- NORMALIZE MODEL ---------------- */

function normalizeModel(object, onStats, wireframe) {
  const box = new THREE.Box3().setFromObject(object)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())

  const maxAxis = Math.max(size.x, size.y, size.z)
  object.scale.setScalar(2 / maxAxis)

  box.setFromObject(object)
  box.getCenter(center)
  object.position.sub(center)

  let meshCount = 0
  let vertexCount = 0

  object.traverse((child) => {
    if (child.isMesh) {
      meshCount++
      vertexCount += child.geometry.attributes.position.count

      if (child.material) {
        child.material.wireframe = wireframe
      }
    }
  })

  onStats({ meshCount, vertexCount })
}

/* ---------------- GLTF MODEL ---------------- */

function GLTFModel({ url, onStats, wireframe, onAnimationReady }) {
  const group = useRef()
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (!scene) return

    normalizeModel(scene, onStats, wireframe)

    if (animations.length > 0) {
      const first = Object.keys(actions)[0]
      const action = actions[first]
      action.play()
      onAnimationReady(action)
    } else {
      onAnimationReady(null)
    }
  }, [scene, animations, actions, wireframe, onStats, onAnimationReady])

  return <primitive ref={group} object={scene} />
}

/* ---------------- OBJ MODEL ---------------- */

function OBJModel({ url, onStats, wireframe }) {
  const object = useLoader(OBJLoader, url)

  useEffect(() => {
    if (!object) return
    normalizeModel(object, onStats, wireframe)
  }, [object, onStats, wireframe])

  return <primitive object={object} />
}

/* ---------------- VIEWER ---------------- */

function Viewer({ fileUrl, fileName, onReset }) {
  const [stats, setStats] = useState(null)
  const [wireframe, setWireframe] = useState(false)
  const [animation, setAnimation] = useState(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [autoRotate, setAutoRotate] = useState(false)
  const [environment, setEnvironment] = useState("city")
  const [selectedMesh, setSelectedMesh] = useState(null)

  const controlsRef = useRef()
  const extension = fileUrl.split(".").pop().toLowerCase()

  const takeScreenshot = () => {
    const canvas = document.querySelector("canvas")
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "screenshot.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const toggleAnimation = () => {
    if (!animation) return
    isPlaying ? animation.stop() : animation.play()
    setIsPlaying(!isPlaying)
  }

  const resetCamera = () => {
    controlsRef.current?.reset()
  }

  const handleSelect = (mesh) => {
    if (!mesh.isMesh) return

    if (selectedMesh?.material?.emissive) {
      selectedMesh.material.emissive.set(0x000000)
    }

    if (mesh.material?.emissive) {
      mesh.material.emissive.set(0x4444ff)
    }

    setSelectedMesh(mesh)
  }

  return (
    <div className="viewer-layout">

      {/* SIDEBAR */}
      <div className="sidebar">

        <div className="sidebar-header">
          <h3>3D Viewer</h3>
          <span>{fileName}</span>
        </div>

        <div className="tool-group">
          <h4>Display</h4>
          <button onClick={() => setWireframe(!wireframe)}>
            {wireframe ? "Normal" : "Wireframe"}
          </button>

          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
          >
            <option value="city">City</option>
            <option value="sunset">Sunset</option>
            <option value="night">Night</option>
            <option value="dawn">Dawn</option>
            <option value="warehouse">Warehouse</option>
            <option value="studio">Studio</option>
          </select>
        </div>

        <div className="tool-group">
          <h4>Camera</h4>
          <button onClick={resetCamera}>Reset Camera</button>
          <button onClick={() => setAutoRotate(!autoRotate)}>
            {autoRotate ? "Stop Rotate" : "Auto Rotate"}
          </button>
        </div>

        {animation && (
          <div className="tool-group">
            <h4>Animation</h4>
            <button onClick={toggleAnimation}>
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>
        )}

        <div className="tool-group">
          <h4>Export</h4>
          <button onClick={takeScreenshot}>Screenshot</button>
        </div>

        <div className="tool-group">
          <button onClick={onReset}>Upload New</button>
        </div>

      </div>

      {/* CANVAS AREA */}
      <div className="canvas-area">

        {stats && (
          <div className="stats-panel">
            <p>Meshes: {stats.meshCount}</p>
            <p>Vertices: {stats.vertexCount}</p>
            {selectedMesh && (
              <p>Selected: {selectedMesh.name || "Unnamed Mesh"}</p>
            )}
          </div>
        )}

        <Canvas
          camera={{ position: [3, 3, 5], fov: 60 }}
          gl={{ preserveDrawingBuffer: true }}
          onPointerDown={(e) => handleSelect(e.object)}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <Environment preset={environment} />

          <Suspense fallback={<Loader />}>
            {extension === "obj" ? (
              <OBJModel url={fileUrl} onStats={setStats} wireframe={wireframe} />
            ) : (
              <GLTFModel
                url={fileUrl}
                onStats={setStats}
                wireframe={wireframe}
                onAnimationReady={setAnimation}
              />
            )}
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enableDamping
            autoRotate={autoRotate}
            autoRotateSpeed={2}
          />
        </Canvas>
      </div>

    </div>
  )
}

export default Viewer
