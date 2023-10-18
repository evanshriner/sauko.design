import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import reflectiveFragment from './shaders/reflectiveFragment.glsl';
import reflectiveVertex from './shaders/vertex2.glsl';

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
  const outerSphereRef = useRef<THREE.ShaderMaterial | null>(null);
  const reflectiveShapeRef = useRef<THREE.ShaderMaterial | null>(null);

  useFrame(() => {
    if (outerSphereRef.current) {
      outerSphereRef.current.uniforms.time.value += 0.005;
    }
  });

  return (
    <>
      <mesh geometry={new THREE.SphereGeometry(4, 32, 32)}>
        <shaderMaterial
          ref={outerSphereRef}
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
      {/* reflective object */}
      <mesh geometry={new THREE.IcosahedronGeometry(1, 1)}>
        <shaderMaterial
          ref={reflectiveShapeRef}
          extensions={{
            derivatives: '#extension GL_OES_standard_derivatives : enable',
          }}
          side={THREE.DoubleSide}
          uniforms={{
            time: { value: 0 },
            resolution: { value: new THREE.Vector4() },
          }}
          vertexShader={reflectiveVertex}
          fragmentShader={reflectiveFragment}
        />
      </mesh>
    </>
  );
}
