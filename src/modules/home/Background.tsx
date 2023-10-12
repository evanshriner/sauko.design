import { OrbitControls } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { Canvas } from '@react-three/fiber';
import Shapes from './Shapes';

export default function Background() {
  return (
    <Canvas
      camera={{
        fov: 90,
        near: 0.01,
        far: 200,
        position: [4, -2, 6],
      }}
    >
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <Shapes />
    </Canvas>
  );
}
