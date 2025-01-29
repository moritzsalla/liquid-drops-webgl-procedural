import * as THREE from "three";

export const Plane = ({ color }: { color: string }) => {
  return (
    <mesh
      position={[0, 0, -1]}
      rotation={[0, -Math.PI, 0]}
      scale={[1.75, 1.15, 1]}
      receiveShadow
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        color={color}
        side={THREE.DoubleSide}
        opacity={0.5}
        transparent={true}
      />
    </mesh>
  );
};
