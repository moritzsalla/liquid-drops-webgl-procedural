import * as THREE from "three";

export const Plane = () => {
  return (
    <mesh
      position={[0, 0, -3]}
      rotation={[0, -Math.PI, 0]}
      scale={[2, 2, 1]}
      receiveShadow // Add this
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        color="pink"
        side={THREE.DoubleSide}
        opacity={0.5}
        transparent={true}
      />
    </mesh>
  );
};
