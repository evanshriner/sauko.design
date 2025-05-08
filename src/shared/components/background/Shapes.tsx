import { useEffect, useMemo, useRef } from 'react';
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

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  format: THREE.RGBAFormat,
  generateMipmaps: true,
  minFilter: THREE.LinearMipmapLinearFilter,
  colorSpace: THREE.SRGBColorSpace,
});

const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);

export default function Shapes({ scrollY = 0 }: { scrollY?: number }) {
  const outerSphereRef = useRef<THREE.ShaderMaterial | null>(null);
  const reflectiveShapeRef = useRef<THREE.ShaderMaterial | null>(null);

  // Memoize the geometry so it's created only once
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(4, 32, 32), []);
  const reflectiveGeometry = useMemo(
    () => new THREE.SphereGeometry(1, 42, 32),
    [],
  );

  // Memoize the uniforms object so it's created only once
  const outerUniforms = useMemo(
    () => ({
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() }, // You might want to update resolution on resize
    }),
    [],
  );

  const reflectiveUniforms = useMemo(
    () => ({
      // Uncomment if needed
      time: { value: 0 },
      tCube: { value: 0 }, // Initialize with null or appropriate default
      resolution: { value: new THREE.Vector4() },
    }),
    [],
  );

  useFrame((state) => {
    if (outerSphereRef.current) {
      // TODO: possibly use delta here?
      outerSphereRef.current.uniforms.time.value += 0.001;
    }

    const { gl, scene, camera } = state; // Get gl, scene, camera from state

    camera.position.y = -scrollY * 0.001;
    cubeCamera.update(gl, scene);
    if (reflectiveShapeRef.current) {
      reflectiveShapeRef.current.uniforms.tCube.value =
        cubeRenderTarget.texture;
    }
    // const cubeRenderTarget = useMemo(
    //   () =>
    //     new THREE.WebGLCubeRenderTarget(256, {
    //       // Memoize render target
    //       format: THREE.RGBAFormat,
    //       generateMipmaps: true,
    //       minFilter: THREE.LinearMipmapLinearFilter,
    //       colorSpace: THREE.SRGBColorSpace,
    //     }),
    //   [],
    // );
    // const cubeCamera = useMemo(
    //   () => new THREE.CubeCamera(0.1, 10, cubeRenderTarget),
    //   [cubeRenderTarget],
    // ); // Memoize camera

    // // Before rendering the main scene
    // if (reflectiveShapeRef.current) {
    //   reflectiveShapeRef.current.visible = false; // Hide the reflective object itself
    //   cubeCamera.position.copy(
    //     reflectiveShapeRef.current.getWorldPosition(new THREE.Vector3()),
    //   ); // Position camera
    //   cubeCamera.update(gl, scene); // Render the scene into the cube texture
    //   reflectiveShapeRef.current.visible = true; // Make it visible again

    //   reflectiveShapeRef.current.uniforms.tCube.value =
    //     cubeRenderTarget.texture;
    //   reflectiveUniforms.tCube.value = cubeRenderTarget.texture; // Also update the memoized uniform's value if needed elsewhere
    // }
  });

  return (
    <>
      <mesh geometry={sphereGeometry}>
        <shaderMaterial
          ref={outerSphereRef}
          extensions={{
            derivatives: '#extension GL_OES_standard_derivatives : enable',
          }}
          side={THREE.DoubleSide}
          uniforms={outerUniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          // R3F specific: Use keys if shader source changes dynamically
          // vertexShader={vertexShader} key={vertexShader}
          // fragmentShader={fragmentShader} key={fragmentShader}
        />
      </mesh>
      {/* --- Reflective Object (if uncommented) --- */}
      <mesh
        // If the reflective object's position will change, useRef is better
        // ref={reflectiveMeshRef} // Add a ref to the mesh itself if needed for positioning
        geometry={reflectiveGeometry}
      >
        <shaderMaterial
          ref={reflectiveShapeRef}
          extensions={{
            derivatives: '#extension GL_OES_standard_derivatives : enable',
          }}
          side={THREE.DoubleSide}
          uniforms={reflectiveUniforms}
          vertexShader={reflectiveVertex}
          fragmentShader={reflectiveFragment}
          // key={reflectiveVertex + reflectiveFragment} // Add key if shaders change
        />
      </mesh>
    </>
  );
}
