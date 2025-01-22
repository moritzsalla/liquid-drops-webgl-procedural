import { animated } from "@react-spring/three";
import { GizmoHelper, GizmoViewport, Grid, Stats } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FRAGMENT_SHADER } from "./shaders/fragment";
import { VERTEX_SHADER } from "./shaders/vertex";

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
  };
};

type LiquidSphereProps = {
  scale?: any;
  position?: [number, number, number];
  colors: Colors;
  wireframe?: boolean;
  shaderConfig: ShaderConfig;
};

export const LiquidSphere = ({
  scale = [1, 1, 1],
  position = [0, 0, 0],
  colors,
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
    ...colors,
  });

  // Update uniforms when config changes
  useEffect(() => {
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

  useEffect(() => {
    uniforms.current.u_resolution.value = [
      window.innerWidth,
      window.innerHeight,
    ];
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.current.u_time.value = state.clock.elapsedTime;
      uniforms.current.u_camera_position.value = state.camera.position;
    }
  });

  return (
    <animated.mesh ref={meshRef} scale={scale} position={position} castShadow>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
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

const random = (min: number, max: number) => Math.random() * (max - min) + min;

export const DevHelpers = () => {
  return (
    <>
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={1}
        cellColor="#6f6f6f"
        sectionSize={5}
      />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["red", "green", "blue"]}
          labelColor="black"
        />
      </GizmoHelper>
      <Stats />
    </>
  );
};

export const Lights = () => {
  return (
    <>
      {/* Main directional light */}
      <directionalLight
        position={[0, 0, 20]}
        intensity={0.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0001}
      />
      {/* Fill light */}
      {/* <directionalLight position={[-5, 3, 0]} intensity={0.4} color="#b1e1ff" /> */}
      {/* Ambient light */}
      {/* <ambientLight intensity={0.2} /> */}
    </>
  );
};

export const Plane = () => {
  return (
    <mesh
      position={[0, 0, -3]}
      rotation={[0, -Math.PI, 0]}
      scale={[20, 20, 1]}
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
