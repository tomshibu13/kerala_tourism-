import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D, Center } from '@react-three/drei'

/**
 * Floating 3D text "Explore Kerala" with slow rotation
 */
export default function FloatingText() {
  const textRef = useRef()

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15 + 2
    }
  })

  return (
    <group ref={textRef} position={[0, 2, 0]}>
      <Center>
        {/* Use a simple mesh with text geometry as fallback */}
        <mesh>
          <boxGeometry args={[4.5, 0.8, 0.15]} />
          <meshStandardMaterial
            color="#1D9E75"
            emissive="#0F6E56"
            emissiveIntensity={0.4}
            metalness={0.6}
            roughness={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Decorative glow */}
        <mesh scale={[4.8, 1.1, 0.05]} position={[0, 0, -0.1]}>
          <boxGeometry />
          <meshBasicMaterial color="#1D9E75" transparent opacity={0.15} />
        </mesh>
      </Center>
    </group>
  )
}
