import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

// const material = new THREE.ShaderMaterial({
//   extensions: {
//     derivatives: '#extension GL_OES_standard_derivatives : enable',
//   },
//   side: THREE.DoubleSide,
//   uniforms: {
//     time: { value: 0 },
//     resolution: { value: new THREE.Vector4() },
//   },
//   // wireframe: true,
//   vertexShader,
//   fragmentShader,
// });

// const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);

export default function Shapes() {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    materialRef.current!.needsUpdate = true;
  }, []);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value += 0.005;
    }
  });

  return (
    <>
      <mesh geometry={new THREE.SphereGeometry(4, 32, 32)}>
        <shaderMaterial
          ref={materialRef}
          extensions={{
            derivatives: '#extension GL_OES_standard_derivatives : enable',
          }}
          side={THREE.DoubleSide}
          uniforms={{
            time: { value: 0 },
            resolution: { value: new THREE.Vector4() },
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </>
  );
}
