import { Canvas } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';

function ToonDuckModel() {
  const { scene } = useGLTF('/models/toon_ducks.glb');
  return <primitive object={scene} scale={3} />;
}

export default function DuckLoader() {
  return (
    <div style={{ width: 180, height: 180, margin: '0 auto' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={1} />
        <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
          <ToonDuckModel />
        </Float>
      </Canvas>
    </div>
  );
}

// Preload the duck model
// @ts-ignore
useGLTF.preload && useGLTF.preload('/models/toon_ducks.glb');
