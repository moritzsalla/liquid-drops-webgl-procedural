import { extend, useFrame, type Object3DNode } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes";

extend({ MarchingCubes });

declare module "@react-three/fiber" {
  interface ThreeElements {
    marchingCubes: Object3DNode<MarchingCubes, typeof MarchingCubes>;
  }
}

type MetaballEffectProps = {
  colors: Array<{
    u_color_0: string;
    u_color_1: string;
    u_color_2: string;
  }>;
  wireframe: boolean;
  enabled: boolean;
};

const useConfig = () => {
  return useControls("metaballs", {
    resolution: {
      value: 80,
      min: 14,
      max: 100,
      step: 1,
    },
    isolation: {
      value: 80,
      min: 10,
      max: 300,
      step: 1,
    },
    strength: {
      value: 0.5,
      min: 0.1,
      max: 5.0,
      step: 0.1,
    },
    scale: {
      value: 16,
      min: 1,
      max: 50,
      step: 1,
    },
    subtract: {
      value: 12,
      min: 1,
      max: 20,
      step: 0.1,
    },
  });
};

export const MetaballEffect = ({
  colors,
  enabled,
  wireframe,
}: MetaballEffectProps) => {
  const meshRef = useRef<MarchingCubes>(null!);
  const metaballsConfig = useConfig();

  useFrame(() => {
    if (!meshRef.current || !enabled) return;

    meshRef.current.reset();

    // Add three metaballs at scaled positions
    const positions = [
      [-3, 0, 0], // Left sphere
      [0, 0, 0], // Center sphere
      [3, 0, 0], // Right sphere
    ];

    positions.forEach((pos, i) => {
      meshRef.current.addBall(
        pos[0] / metaballsConfig.scale + 0.5,
        pos[1] / metaballsConfig.scale + 0.5,
        pos[2] / metaballsConfig.scale + 0.5,
        metaballsConfig.strength,
        metaballsConfig.subtract
      );
    });

    meshRef.current.update();
  });

  if (!enabled) return null;

  return (
    <marchingCubes
      ref={meshRef}
      args={[
        metaballsConfig.resolution,
        new THREE.MeshStandardMaterial({ color: "#9c0000" }),
        true,
        true,
      ]}
      isolation={metaballsConfig.isolation}
      scale={metaballsConfig.scale}
    >
      <meshStandardMaterial
        wireframe={wireframe}
        roughness={0.1}
        metalness={0.3}
        color={colors[0].u_color_0}
      />
    </marchingCubes>
  );
};
