import { Canvas } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';

function ToonDuckModel() {
  const { scene } = useGLTF('/models/toon_ducks.glb');
  // Adjust scale and position to fit loader view
  return <primitive object={scene} scale={2.2} position={[0, -0.6, 0]} />;
}

export default function DuckLoader() {
  return (
    <div style={{ width: 240, height: 240, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }} style={{ background: 'transparent' }}>
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
