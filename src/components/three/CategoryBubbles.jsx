import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * 3D floating category bubbles 
 */
export default function CategoryBubbles({ categories = [] }) {
  const groupRef = useRef()
  
  const positions = useMemo(() => {
    const radius = 3
    return categories.map((_, i) => {
      const angle = (i / categories.length) * Math.PI * 2
      return [
        Math.cos(angle) * radius,
        Math.sin(i * 1.5) * 0.5,
        Math.sin(angle) * radius * 0.6,
      ]
    })
  }, [categories])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 2]} intensity={1} color="#1D9E75" />
      
      {categories.map((cat, i) => (
        <BubbleSphere
          key={cat.id}
          position={positions[i]}
          color={cat.color}
          index={i}
        />
      ))}
    </group>
  )
}

function BubbleSphere({ position, color, index }) {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = 
        position[1] + Math.sin(state.clock.elapsedTime * 0.6 + index * 1.2) * 0.3
      ref.current.scale.setScalar(
        0.9 + Math.sin(state.clock.elapsedTime * 0.4 + index) * 0.1
      )
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.7}
        roughness={0.1}
        metalness={0.4}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}
