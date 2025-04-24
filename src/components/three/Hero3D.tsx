import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, useGLTF } from '@react-three/drei';

function ClapboardModel() {
  // Use correct path for production/public serving
  const { scene } = useGLTF('/models/clapperboard.glb');
  // Scale remains large for visual impact
  return <primitive object={scene} scale={16} />;
}

export default function Hero3D() {
  return (
    <div style={{ width: '100%', height: '500px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} shadows>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
          <ClapboardModel />
        </Float>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

// Required for GLTF loading
// @ts-ignore
useGLTF.preload && useGLTF.preload('/models/clapperboard.glb');
