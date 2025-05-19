import { OrbitControls } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { Canvas } from '@react-three/fiber';
import { DotScreen, EffectComposer, Noise } from '@react-three/postprocessing';

import Shapes from './Shapes';
import { BlendFunction } from 'postprocessing';
import CustomDotScreen from './shaders/CustomDotScreen';

export default function Background({ scrollY }: { scrollY: number }) {
  return (
    <Canvas
      camera={{
        fov: 90,
        near: 0.01,
        far: 200,
        position: [1.5, 0, 0.1],
      }}
    >
      {/* <Perf position="top-left" /> */}
      {/* 
      <OrbitControls makeDefault /> */}

      <Shapes scrollY={scrollY} />
      <EffectComposer>
        {/* <DotScreen
          blendFunction={BlendFunction.NORMAL} // Try other modes like ADD, SCREEN, OVERLAY
          angle={Math.PI / 12} // A different angle
          // TODO: possible adjust scale based on music visualization?
          // settings like 0.1 and 0.03 look really cool here as well.
          scale={0.73} // Adjust scale
        /> */}
        {/* <CustomDotScreen /> */}
        <Noise opacity={0.028} />
      </EffectComposer>
    </Canvas>
  );
}
