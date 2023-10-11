import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// spiraly thing (needs about 30 shapes)
// const torusGeometry = new THREE.TorusKnotGeometry(10.184, 0.1, 92, 7, 3, 9);
const torusGeometry = new THREE.TorusKnotGeometry(20, 0.3681, 66, 8, 20, 6);
const material = new THREE.MeshDepthMaterial({ opacity: 0.2 });

export default function Shapes() {
  const triangles = useRef([]);

  useFrame((state, delta) => {
    for (const triangle of triangles.current) {
      triangle.rotation.y += delta * 0.05;
    }
  });

  useEffect(() => {
    material.needsUpdate = true;
  }, []);

  return (
    <>
      {[...Array(3)].map((value, index) => (
        <mesh
          ref={(element) => (triangles.current[index] = element)}
          key={index}
          geometry={torusGeometry}
          material={material}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          scale={0.2 + Math.random() * 0.2}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        />
      ))}
    </>
  );
}
