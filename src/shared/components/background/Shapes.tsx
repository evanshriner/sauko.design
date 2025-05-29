import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import {
  fragmentShader as wavesFragment,
  vertexShader as wavesVertex,
} from './shaders/BackgroundWaves';

import {
  fragmentShader as reflectiveFragment,
  vertexShader as reflectiveVertex,
} from './shaders/FresnelReflection';

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  format: THREE.RGBAFormat,
  generateMipmaps: true,
  minFilter: THREE.LinearMipmapLinearFilter,
  colorSpace: THREE.SRGBColorSpace,
});

const cubeCamera = new THREE.CubeCamera(4, 0.2, cubeRenderTarget);

export default function Shapes({ scrollY = 0 }: { scrollY?: number }) {
  const outerSphereRef = useRef<THREE.ShaderMaterial | null>(null);
  const reflectiveShapeRef = useRef<THREE.ShaderMaterial | null>(null);
  const boomboxMeshRef = useRef<THREE.Mesh | null>(null);
  const laptopMeshRef = useRef<THREE.Mesh | null>(null);
  // useGLTF loads your model asynchronously.
  // You should wrap your model-rendering component or the model itself in <React.Suspense> to show a fallback (like a loader or null) while the model is loading.
  const {
    scene: boomboxScene,
    materials: boomboxMaterials,
    nodes: boomboxNodes,
  } = useGLTF('/Boombox.glb');

  const {
    scene: laptopScene,
    materials: laptopMaterials,
    nodes: laptopNodes,
  } = useGLTF('/Laptop.glb');

  const {
    scene: postedLetterGLTFScene, // Renamed to avoid confusion with the processed scene
    nodes: postedLetterNodes,
    materials: postedLetterMaterials, // Available if needed, but we'll override
  } = useGLTF('/PostedLetter.glb');

  // useEffect(() => {
  //   console.log('Boombox Scene:', postedLetterScene);
  //   console.log('Boombox Materials:', postedLetterMaterials);
  //   console.log('Boombox Nodes:', postedLetterNodes);
  // }, []);

  // Memoize the geometry so it's created only once
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(4, 32, 32), []);
  // const reflectiveGeometry = useMemo(
  //   () => new THREE.SphereGeometry(0.5, 42, 32),
  //   [],
  // );
  // Clone the scene if you intend to modify it or use it multiple times
  // to avoid issues with React re-rendering and Three.js object identity.
  // For just displaying, this might not be strictly necessary but is good practice.
  const boomboxModel = useMemo(() => boomboxScene.clone(), [boomboxScene]);

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

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (outerSphereRef.current) {
      // TODO: possibly use delta here?
      outerSphereRef.current.uniforms.time.value += 0.001;
    }

    const { gl, scene, camera } = state; // Get gl, scene, camera from state

    // Orbit parameters
    const radius = 1.3; // Distance from center
    const speed = 0.06; // Radians per second
    const t = time * speed;

    camera.position.x = Math.cos(t) * radius;
    camera.position.z = Math.sin(t) * radius;
    camera.position.y = 0.3; // Keep your scroll effect if needed

    camera.lookAt(0, 0.3, 0); // Always look at the center

    if (reflectiveShapeRef.current) {
      // Temporarily hide all objects that use the reflective material before updating the cube camera
      // to prevent a visual feedback loop.
      const meshesToHide: THREE.Mesh[] = [];
      if (
        boomboxMeshRef.current &&
        boomboxMeshRef.current.material === reflectiveShapeRef.current
      ) {
        meshesToHide.push(boomboxMeshRef.current);
      }
      if (
        laptopMeshRef.current &&
        laptopMeshRef.current.material === reflectiveShapeRef.current
      ) {
        meshesToHide.push(laptopMeshRef.current);
      }

      meshesToHide.forEach((mesh) => (mesh.visible = false));

      cubeCamera.update(gl, scene);

      meshesToHide.forEach((mesh) => (mesh.visible = true));
      reflectiveShapeRef.current.uniforms.tCube.value =
        cubeRenderTarget.texture;
    }
    const orbitCenter = new THREE.Vector3(0, 0, 0); // --- Boombox Animation: Orbit, Rotation, Floating ---

    const orbitRadius = 1;

    if (boomboxMeshRef.current) {
      boomboxMeshRef.current.position.y =
        orbitCenter.y + Math.sin(time * 0.7) * 0.02; // Rotation

      boomboxMeshRef.current.rotation.y = -t - (4.73 + Math.sin(time * 2) * 0.01);
      // boomboxMeshRef.current.position.z = Math.sin(t) * radius;
    }

    if (laptopMeshRef.current) {
      laptopMeshRef.current.position.y =
        orbitCenter.y + Math.sin(time * 0.6 + Math.PI / 2) * 0.12; // Rotation
    }
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
          vertexShader={wavesVertex}
          fragmentShader={wavesFragment}
          // R3F specific: Use keys if shader source changes dynamically
          // vertexShader={vertexShader} key={vertexShader}
          // fragmentShader={fragmentShader} key={fragmentShader}
        />
      </mesh>
      {/* --- Reflective Object (if uncommented) --- */}
      {/* <mesh
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
      </mesh> */}

      {/* <primitive
        object={boomboxModel}
        scale={0.2} // Example: Adjust scale as needed
        position={[0, -1, 0]} // Example: Adjust position as needed
      /> */}
      {boomboxNodes.Boombox_mesh && (
        <mesh
          geometry={(boomboxNodes.Boombox_mesh as THREE.Mesh).geometry}
          scale={0.45}
          ref={boomboxMeshRef}
          position={[0, 0, 0]}
        >
          <shaderMaterial
            ref={reflectiveShapeRef} // Or a new ref if this shader instance is unique
            extensions={{
              derivatives: '#extension GL_OES_standard_derivatives : enable',
            }}
            side={THREE.DoubleSide}
            uniforms={reflectiveUniforms} // Make sure these uniforms make sense for the Boombox
            vertexShader={reflectiveVertex}
            fragmentShader={reflectiveFragment}
          />
        </mesh>
      )}

      {/* {laptopNodes.Laptop_mesh && (
        <mesh
          geometry={(laptopNodes.Laptop_mesh as THREE.Mesh).geometry}
          scale={0.4}
          ref={laptopMeshRef}
          position={[-0.7, 1.5, 0]}
          rotation={[0, Math.PI / 4, 0]}
        >
          <shaderMaterial
            ref={reflectiveShapeRef} // Or a new ref if this shader instance is unique
            extensions={{
              derivatives: '#extension GL_OES_standard_derivatives : enable',
            }}
            side={THREE.DoubleSide}
            uniforms={reflectiveUniforms} // Make sure these uniforms make sense for the Boombox
            vertexShader={reflectiveVertex}
            fragmentShader={reflectiveFragment}
          />
        </mesh>
      )} */}
    </>
  );
}
