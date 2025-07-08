import { OrbitControls } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { Canvas } from '@react-three/fiber';
import { Bloom, DepthOfField, DotScreen, EffectComposer, Sepia, Vignette } from '@react-three/postprocessing';
import { useEffect, useRef, useState } from 'react';

import Shapes from './Shapes';
import { DisplayedObject, objectConfigurations } from './ShapeConfig';
import { Pages } from '@/shared/interfaces/pages';
import { BlendFunction } from 'postprocessing';
import CustomDotScreen from './shaders/CustomDotScreen';

export default function Background({
  scrollY,
  currentPage,
}: {
  scrollY: number;
  currentPage?: Pages;
}) {
 
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

      <Shapes
        scrollY={scrollY}
        selectedObjectKey={
          objectConfigurations.find((config) => config.page === currentPage)
            ?.id || DisplayedObject.Boombox
        }
      />
      <EffectComposer>
        {/* <DotScreen
          blendFunction={BlendFunction.NORMAL} // Try other modes like ADD, SCREEN, OVERLAY
          angle={Math.PI / 12} // A different angle
          // TODO: possible adjust scale based on music visualization?
          // settings like 0.1 and 0.03 look really cool here as well.
          scale={0.1} // Adjust scale
        /> */}
        <CustomDotScreen /> 
        {/* <Pixelation
    granularity={20} // pixel granularity
  /> could have this follow mouse */} 
    <Sepia
    intensity={0.10} // sepia intensity
    blendFunction={BlendFunction.NORMAL} // blend mode
  />
    <Vignette
    offset={0.6} // vignette offset
    darkness={0.4} // vignette darkness
    eskil={false} // Eskil's vignette technique
    blendFunction={BlendFunction.NORMAL} // blend mode
   />
      </EffectComposer>
    </Canvas>
  );
}
