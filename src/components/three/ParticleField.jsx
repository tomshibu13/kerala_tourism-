import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Green and teal particle field representing Kerala's nature
 */
export default function ParticleField({ count = 300 }) {
  const meshRef = useRef()

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    const greens = [
      new THREE.Color('#0F6E56'),
      new THREE.Color('#1D9E75'),
      new THREE.Color('#25c28f'),
      new THREE.Color('#a8e6cf'),
    ]

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15

      const color = greens[Math.floor(Math.random() * greens.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      sizes[i] = Math.random() * 0.05 + 0.02
    }

    return { positions, colors, sizes }
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const positions = meshRef.current.geometry.attributes.position.array
    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      // Gentle floating motion
      positions[i * 3 + 1] += Math.sin(time * 0.3 + i * 0.1) * 0.002
      positions[i * 3] += Math.cos(time * 0.2 + i * 0.15) * 0.001
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
