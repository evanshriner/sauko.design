import { OrbitControls } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { Canvas } from '@react-three/fiber';
import { DotScreen, EffectComposer, Noise } from '@react-three/postprocessing';

import Shapes from './Shapes';
import { DisplayedObject } from './ShapeConfig';

export default function Background({ scrollY, object }: { scrollY: number; object?: DisplayedObject }) {
  return (
    <Canvas
      camera={{
        fov: 70,
        near: 0.01,
        far: 100,
        // position is being interpolated in the Shapes component
        position: [0, 0, 0],
      }}
    >
      {/* <Perf position="top-left" /> */}
      {/* 
      <OrbitControls makeDefault /> */}

      <Shapes scrollY={scrollY} selectedObjectKey={object || DisplayedObject.Boombox} />
      <EffectComposer>
        {/* <DotScreen
          blendFunction={BlendFunction.NORMAL} // Try other modes like ADD, SCREEN, OVERLAY
          angle={Math.PI / 12} // A different angle
          // TODO: possible adjust scale based on music visualization?
          // settings like 0.1 and 0.03 look really cool here as well.
          scale={10.13} // Adjust scale
        /> */}
        {/* <CustomDotScreen /> */}
        <Noise opacity={0.028} />
      </EffectComposer>
    </Canvas>
  );
}
