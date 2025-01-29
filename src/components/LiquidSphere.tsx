import { animated } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { random } from "../utils/random";
import { SPHERE_VERTEX_SHADER } from "../shaders/sphere/vertex";
import { SPHERE_FRAGMENT_SHADER } from "../shaders/sphere/fragment";

type Color = [number, number, number, number];
type Colors = {
  u_color_0: { value: Color };
  u_color_1: { value: Color };
  u_color_2: { value: Color };
};

export type ShaderConfig = {
  vertex: {
    distortionAmount: number;
    timeScale: number;
    distortionWeights?: [number, number, number];
  };
  fragment: {
    noiseScale: number;
    noiseSpeed: number;
    noiseIntensity: number;
    noiseWeights?: [number, number, number];
    blendSoftness: number;
    flowSpeed: number;
    colors: Colors;
  };
};

type LiquidSphereProps = {
  scale?: any;
  position?: [number, number, number];
  wireframe?: boolean;
  shaderConfig: ShaderConfig;
};

export const LiquidSphere = ({
  scale = [1, 1, 1],
  position = [0, 0, 0],
  wireframe = false,
  shaderConfig,
}: LiquidSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Combine our custom uniforms with Three.js built-in uniforms
  const uniforms = useRef({
    ...THREE.UniformsLib.lights,
    u_resolution: { value: [0, 0] },
    u_time_offset: { value: random(0, 100) },
    u_time: { value: 0 },

    // Vertex shader uniforms
    u_distortionAmount: { value: shaderConfig.vertex.distortionAmount },
    u_timeScale: { value: shaderConfig.vertex.timeScale },
    u_distortionWeights: {
      value: shaderConfig.vertex.distortionWeights || [1.0, 1.0, 1.0],
    },

    // Fragment shader uniforms
    u_noiseScale: { value: shaderConfig.fragment.noiseScale },
    u_noiseSpeed: { value: shaderConfig.fragment.noiseSpeed },
    u_noiseIntensity: { value: shaderConfig.fragment.noiseIntensity },
    u_noiseWeights: {
      value: shaderConfig.fragment.noiseWeights || [0.5, 0.3, 0.2],
    },
    u_blendSoftness: { value: shaderConfig.fragment.blendSoftness },
    u_flowSpeed: { value: shaderConfig.fragment.flowSpeed },

    // Other uniforms
    u_offset: { value: [random(0, 10), random(0, 10)] },
    u_camera_position: { value: new THREE.Vector3() },
    u_light_position: { value: new THREE.Vector3(-40, 40, 10) },

    ...shaderConfig.fragment.colors,
  });

  // Update uniforms when config changes
  useEffect(() => {
    // Update color uniforms on change
    for (const key in shaderConfig.fragment.colors) {
      const uniform = uniforms.current[key as keyof Colors];
      uniform.value = shaderConfig.fragment.colors[key as keyof Colors].value;
    }

    // Other uniforms
    uniforms.current.u_distortionAmount.value =
      shaderConfig.vertex.distortionAmount;
    uniforms.current.u_timeScale.value = shaderConfig.vertex.timeScale;
    uniforms.current.u_noiseScale.value = shaderConfig.fragment.noiseScale;
    uniforms.current.u_noiseSpeed.value = shaderConfig.fragment.noiseSpeed;
    uniforms.current.u_noiseIntensity.value =
      shaderConfig.fragment.noiseIntensity;
    uniforms.current.u_blendSoftness.value =
      shaderConfig.fragment.blendSoftness;
    uniforms.current.u_flowSpeed.value = shaderConfig.fragment.flowSpeed;
  }, [shaderConfig]);

  // u_resolution
  useResolutionUniform({
    uniforms,
  });

  // u_time
  useTimeUniform({
    meshRef,
    uniforms,
  });

  return (
    <animated.mesh
      ref={meshRef}
      scale={[scale, scale, scale * 0.25]}
      position={position}
      castShadow
    >
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={SPHERE_VERTEX_SHADER}
        fragmentShader={SPHERE_FRAGMENT_SHADER}
        uniforms={uniforms.current}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
        wireframe={wireframe}
        shadowSide={THREE.DoubleSide}
        lights={true}
      />
    </animated.mesh>
  );
};

const useResolutionUniform = ({
  uniforms,
}: {
  uniforms: React.MutableRefObject<any>;
}) => {
  useEffect(() => {
    uniforms.current.u_resolution.value = [
      window.innerWidth,
      window.innerHeight,
    ];
  }, [uniforms]);
};

const useTimeUniform = ({
  meshRef,
  uniforms,
}: {
  meshRef: React.MutableRefObject<THREE.Mesh | null>;
  uniforms: React.MutableRefObject<any>;
}) => {
  useFrame((state) => {
    if (meshRef.current) {
      uniforms.current.u_time.value = state.clock.elapsedTime;
      uniforms.current.u_camera_position.value = state.camera.position;
    }
  });
};
