import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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

// const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
//   format: THREE.RGBAFormat,
//   generateMipmaps: true,
//   minFilter: THREE.LinearMipmapLinearFilter,
//   colorSpace: THREE.SRGBColorSpace,
// });

// const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);

export default function Shapes() {
  const outerSphereRef = useRef<THREE.ShaderMaterial | null>(null);
  const reflectiveShapeRef = useRef<THREE.ShaderMaterial | null>(null);

  // const { gl, scene } = useThree();
  useFrame(() => {
    if (outerSphereRef.current) {
      outerSphereRef.current.uniforms.time.value += 0.005;
    }
    // cubeCamera.update(gl, scene);
    // if (reflectiveShapeRef.current) {
    //   reflectiveShapeRef.current.uniforms.tCube.value =
    //     cubeRenderTarget.texture;
    // }
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
      {/* <mesh geometry={new THREE.SphereGeometry(1, 42, 32)}>
        <shaderMaterial
          ref={reflectiveShapeRef}
          extensions={{
            derivatives: '#extension GL_OES_standard_derivatives : enable',
          }}
          side={THREE.DoubleSide}
          uniforms={{
            time: { value: 0 },
            tCube: { value: 0 },
            resolution: { value: new THREE.Vector4() },
          }}
          vertexShader={reflectiveVertex}
          fragmentShader={reflectiveFragment}
        />
      </mesh> */}
    </>
  );
}
