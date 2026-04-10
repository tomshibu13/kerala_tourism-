import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Immersive 3D Kerala Landscape — lush hills, animated river, 
 * coconut trees, mist, fireflies, and sunset atmosphere
 */
export default function KeralaLandscape() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.06) * 0.04
    }
  })

  return (
    <group ref={groupRef} position={[0, -2.5, 0]}>
      {/* === Lighting — warm sunset/golden hour feel === */}
      <ambientLight intensity={0.3} color="#c4e0b8" />
      <directionalLight position={[8, 12, 4]} intensity={1.5} color="#ffe4b5" castShadow />
      <directionalLight position={[-6, 8, -4]} intensity={0.4} color="#87ceab" />
      <pointLight position={[0, 6, -8]} intensity={0.6} color="#ff9966" distance={20} />
      <pointLight position={[-8, 2, 2]} intensity={0.3} color="#1D9E75" distance={15} />
      <pointLight position={[6, 1, 4]} intensity={0.25} color="#66ccaa" distance={12} />

      {/* === Sky Gradient Backdrop === */}
      <SkyGradient />

      {/* === Sun/Moon Glow === */}
      <mesh position={[6, 9, -18]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#ffcc77" transparent opacity={0.6} />
      </mesh>
      <mesh position={[6, 9, -18.5]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#ff9944" transparent opacity={0.12} />
      </mesh>

      {/* === Ground — layered for depth === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <planeGeometry args={[60, 60, 64, 64]} />
        <meshStandardMaterial color="#0d543e" roughness={1} />
      </mesh>
      {/* Grass layer */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 2]}>
        <planeGeometry args={[40, 20, 32, 32]} />
        <meshStandardMaterial color="#1a7a5a" roughness={0.9} transparent opacity={0.7} />
      </mesh>

      {/* === Distant Mountain Range (far back) === */}
      <MountainRange />

      {/* === Rolling Hills (mid-ground) === */}
      <Hill position={[-6, 0, -8]} scale={[5, 3, 4]} color="#0a5a42" />
      <Hill position={[4, 0, -10]} scale={[6, 3.5, 5]} color="#0d6650" />
      <Hill position={[-2, 0, -13]} scale={[8, 4.5, 6]} color="#084835" />
      <Hill position={[8, 0, -11]} scale={[4, 2.5, 3.5]} color="#0b5c47" />
      <Hill position={[-9, 0, -12]} scale={[5, 3, 4.5]} color="#07402f" />
      
      {/* Foreground rolling hills */}
      <Hill position={[-5, 0, -4]} scale={[3, 1.5, 2.2]} color="#0F6E56" />
      <Hill position={[5, 0, -5]} scale={[3.5, 1.8, 2.5]} color="#0e6850" />
      <Hill position={[0, 0, -6]} scale={[2.5, 1.2, 2]} color="#107a5c" />

      {/* === Animated River with realistic flow === */}
      <AnimatedRiver />

      {/* === Coconut Trees — varied sizes and positions === */}
      <CoconutTree position={[-4, 0, -2]} scale={0.8} lean={0.06} />
      <CoconutTree position={[2.5, 0, -2.5]} scale={0.9} lean={-0.04} />
      <CoconutTree position={[-6.5, 0, -3.5]} scale={0.65} lean={0.08} />
      <CoconutTree position={[5, 0, -1.5]} scale={0.75} lean={-0.06} />
      <CoconutTree position={[0.5, 0, -4]} scale={0.7} lean={0.03} />
      <CoconutTree position={[-3, 0, -5.5]} scale={0.55} lean={0.05} />
      <CoconutTree position={[6.5, 0, -4.5]} scale={0.6} lean={-0.07} />
      <CoconutTree position={[-1.5, 0, -1.5]} scale={0.85} lean={-0.03} />
      <CoconutTree position={[3.5, 0, -6]} scale={0.5} lean={0.04} />
      <CoconutTree position={[-8, 0, -5]} scale={0.55} lean={0.09} />

      {/* === Bushes / Foliage clumps === */}
      <Bush position={[-2, -0.2, -1]} scale={0.6} color="#147a52" />
      <Bush position={[3, -0.2, -3]} scale={0.5} color="#0d6e4d" />
      <Bush position={[-5, -0.2, -2.5]} scale={0.45} color="#1a8a60" />
      <Bush position={[1, -0.2, -3.5]} scale={0.55} color="#128a56" />
      <Bush position={[6, -0.2, -2]} scale={0.4} color="#0e7550" />
      <Bush position={[-7, -0.2, -4]} scale={0.5} color="#117048" />

      {/* === Mist / Fog Layer === */}
      <MistLayers />

      {/* === Fireflies === */}
      <Fireflies count={40} />

      {/* === Clouds === */}
      <Cloud position={[-5, 7, -12]} scale={[4, 0.8, 2]} />
      <Cloud position={[3, 8, -14]} scale={[5, 1, 2.5]} />
      <Cloud position={[-8, 6.5, -10]} scale={[3, 0.6, 1.5]} />
      <Cloud position={[7, 7.5, -13]} scale={[3.5, 0.7, 2]} />
    </group>
  )
}

/* ─── Sky Gradient Backdrop ─── */
function SkyGradient() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color('#0a1628') },
        midColor: { value: new THREE.Color('#1a3a4a') },
        bottomColor: { value: new THREE.Color('#ff8844') },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 bottomColor;
        varying vec2 vUv;
        void main() {
          vec3 color = mix(bottomColor, midColor, smoothstep(0.0, 0.45, vUv.y));
          color = mix(color, topColor, smoothstep(0.45, 1.0, vUv.y));
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    })
  }, [])

  return (
    <mesh position={[0, 8, -20]} scale={[80, 30, 1]} material={material}>
      <planeGeometry />
    </mesh>
  )
}

/* ─── Distant Mountain Range ─── */
function MountainRange() {
  const mountains = [
    { x: -12, h: 6, w: 5, color: '#052a20' },
    { x: -6, h: 7, w: 6, color: '#063525' },
    { x: 0, h: 8, w: 7, color: '#052e22' },
    { x: 6, h: 6.5, w: 5, color: '#063828' },
    { x: 12, h: 5.5, w: 5.5, color: '#04261c' },
    { x: -3, h: 5, w: 4, color: '#07402f' },
    { x: 9, h: 7, w: 6, color: '#053020' },
  ]
  return (
    <group>
      {mountains.map((m, i) => (
        <mesh key={i} position={[m.x, m.h * 0.4, -18 - i * 0.5]}>
          <coneGeometry args={[m.w, m.h, 6]} />
          <meshStandardMaterial color={m.color} roughness={0.95} flatShading />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Hill ─── */
function Hill({ position, scale, color }) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={color} roughness={0.85} flatShading />
    </mesh>
  )
}

/* ─── Animated River ─── */
function AnimatedRiver() {
  const ref = useRef()
  const ref2 = useRef()

  const riverGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-12, 0)
    shape.bezierCurveTo(-8, 3, -5, -1, -1, 1.5)
    shape.bezierCurveTo(2, 3, 4, 0, 7, 1)
    shape.lineTo(12, 2)
    shape.lineTo(12, 1)
    shape.bezierCurveTo(4, -0.5, 2, 2.5, -1, 0.8)
    shape.bezierCurveTo(-5, -1.5, -8, 2.5, -12, -0.5)
    shape.closePath()
    return new THREE.ShapeGeometry(shape, 32)
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref.current) {
      ref.current.material.opacity = 0.55 + Math.sin(t * 1.5) * 0.1
      ref.current.material.emissiveIntensity = 0.1 + Math.sin(t * 2) * 0.05
    }
    if (ref2.current) {
      ref2.current.material.opacity = 0.2 + Math.sin(t * 2 + 1) * 0.08
    }
  })

  return (
    <group>
      {/* Main water body */}
      <mesh ref={ref} geometry={riverGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 1.5]}>
        <meshStandardMaterial
          color="#1a7fb5"
          emissive="#0d5a8a"
          emissiveIntensity={0.1}
          transparent
          opacity={0.6}
          roughness={0.15}
          metalness={0.4}
        />
      </mesh>
      {/* Shimmer/reflection layer */}
      <mesh ref={ref2} geometry={riverGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.33, 1.5]}>
        <meshStandardMaterial
          color="#88ddff"
          transparent
          opacity={0.2}
          roughness={0.05}
          metalness={0.8}
        />
      </mesh>
    </group>
  )
}

/* ─── Coconut Tree ─── */
function CoconutTree({ position, scale = 1, lean = 0 }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = lean + Math.sin(state.clock.elapsedTime * 0.7 + position[0] * 2) * 0.025
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + position[2]) * 0.01
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Trunk — slight curve via two segments */}
      <mesh position={[0, 0.8, 0]} rotation={[0, 0, lean * 0.5]}>
        <cylinderGeometry args={[0.055, 0.1, 1.6, 8]} />
        <meshStandardMaterial color="#5a3d20" roughness={0.95} />
      </mesh>
      <mesh position={[lean * 3, 2.2, 0]} rotation={[0, 0, lean * 0.8]}>
        <cylinderGeometry args={[0.04, 0.06, 1.4, 8]} />
        <meshStandardMaterial color="#6b4a2a" roughness={0.95} />
      </mesh>
      <mesh position={[lean * 5, 3.4, 0]} rotation={[0, 0, lean]}>
        <cylinderGeometry args={[0.03, 0.045, 1.2, 8]} />
        <meshStandardMaterial color="#7a5430" roughness={0.9} />
      </mesh>

      {/* Crown — leaves radiate outward */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const droop = 0.5 + (i % 3) * 0.15
        return (
          <mesh
            key={i}
            position={[
              Math.cos(rad) * 0.35 + lean * 5,
              3.9 - droop * 0.2,
              Math.sin(rad) * 0.35,
            ]}
            rotation={[
              Math.cos(rad) * droop,
              0,
              Math.sin(rad) * droop,
            ]}
          >
            <coneGeometry args={[0.1, 1.4, 4]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#1a8a55' : '#22a265'}
              flatShading
              roughness={0.8}
            />
          </mesh>
        )
      })}

      {/* Coconuts cluster */}
      {[
        [0.08, 3.7, 0.08],
        [-0.06, 3.65, -0.05],
        [0.02, 3.6, -0.1],
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0] + lean * 5, pos[1], pos[2]]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#7a6520" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Bush / Foliage Clump ─── */
function Bush({ position, scale = 1, color = '#147a52' }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.5, 12, 10]} />
        <meshStandardMaterial color={color} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.3, 0.2, 0.2]}>
        <sphereGeometry args={[0.35, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.25, 0.25, -0.15]}>
        <sphereGeometry args={[0.3, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} flatShading />
      </mesh>
    </group>
  )
}

/* ─── Mist / Fog Layers ─── */
function MistLayers() {
  const ref1 = useRef()
  const ref2 = useRef()
  const ref3 = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref1.current) {
      ref1.current.position.x = Math.sin(t * 0.08) * 2
      ref1.current.material.opacity = 0.06 + Math.sin(t * 0.15) * 0.025
    }
    if (ref2.current) {
      ref2.current.position.x = Math.cos(t * 0.06) * 3
      ref2.current.material.opacity = 0.05 + Math.sin(t * 0.12 + 1) * 0.02
    }
    if (ref3.current) {
      ref3.current.position.x = Math.sin(t * 0.1 + 2) * 1.5
      ref3.current.material.opacity = 0.04 + Math.sin(t * 0.1 + 2) * 0.02
    }
  })

  return (
    <group>
      <mesh ref={ref1} position={[0, 1.5, -6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 8]} />
        <meshBasicMaterial color="#a8d8c8" transparent opacity={0.07} depthWrite={false} />
      </mesh>
      <mesh ref={ref2} position={[0, 2.5, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[35, 6]} />
        <meshBasicMaterial color="#88ccaa" transparent opacity={0.05} depthWrite={false} />
      </mesh>
      <mesh ref={ref3} position={[0, 0.8, -3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[25, 5]} />
        <meshBasicMaterial color="#b8e8d4" transparent opacity={0.04} depthWrite={false} />
      </mesh>
    </group>
  )
}

/* ─── Fireflies ─── */
function Fireflies({ count = 40 }) {
  const ref = useRef()

  const data = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const offsets = []
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = Math.random() * 5 + 0.5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12
      offsets.push(Math.random() * Math.PI * 2)
    }
    return { positions, offsets }
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const positions = ref.current.geometry.attributes.position.array
    const t = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const off = data.offsets[i]
      positions[i * 3] += Math.sin(t * 0.4 + off) * 0.003
      positions[i * 3 + 1] += Math.cos(t * 0.6 + off * 1.3) * 0.002
      positions[i * 3 + 2] += Math.sin(t * 0.3 + off * 0.7) * 0.002
    }
    ref.current.geometry.attributes.position.needsUpdate = true

    // Twinkle
    ref.current.material.opacity = 0.5 + Math.sin(t * 3) * 0.2
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={data.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffffaa"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ─── Cloud ─── */
function Cloud({ position, scale }) {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.04 + position[0]) * 1.5
    }
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[1, 12, 10]} />
        <meshBasicMaterial color="#a0c8b8" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh position={[0.7, 0.1, 0]}>
        <sphereGeometry args={[0.7, 10, 8]} />
        <meshBasicMaterial color="#90b8a8" transparent opacity={0.06} depthWrite={false} />
      </mesh>
      <mesh position={[-0.6, -0.05, 0.2]}>
        <sphereGeometry args={[0.8, 10, 8]} />
        <meshBasicMaterial color="#98c0b0" transparent opacity={0.07} depthWrite={false} />
      </mesh>
    </group>
  )
}
