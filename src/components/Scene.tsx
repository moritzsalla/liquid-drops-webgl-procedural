import {
  OrbitControls,
  OrthographicCamera,
  SoftShadows,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { LiquidSphere } from "./LiquidSphere";
import { Lights } from "./Lights";
import { Plane } from "./Plane";
import { DevHelpers } from "./DevHelpers";
import { useControls } from "leva";
import { MetaballEffect } from "./MetaballEffect";
import { hexToRGBA } from "../utils/random";

export type SphereData = {
  positions: Array<[number, number, number]>;
  colors: Array<Array<{ value: string }>>;
};

export const Scene = () => {
  const {
    viewport,
    metaballs,
    renderer,
    plane,
    shader,
    shadows,
    sphere1,
    sphere2,
    sphere3,
  } = useConfig();

  const sharedConfig = {
    vertex: {
      distortionAmount: shader.distortionAmount,
      timeScale: shader.timeScale,
      distortionWeights: shader.distortionWeights as [number, number, number],
    },
    fragment: {
      noiseScale: shader.noiseScale,
      noiseSpeed: shader.noiseSpeed,
      noiseIntensity: shader.noiseIntensity,
      noiseWeights: shader.noiseWeights as [number, number, number],
      blendSoftness: shader.blendSoftness,
      flowSpeed: shader.flowSpeed,
    },
  };

  return (
    <Canvas
      shadows
      style={{
        background: "black",
      }}
      gl={{
        powerPreference: renderer.powerPreference as WebGLPowerPreference,
        alpha: renderer.alpha,
        antialias: renderer.antialias,
        stencil: renderer.stencil,
        depth: renderer.depth,
      }}
    >
      {shadows.enabled && (
        <SoftShadows size={shadows.size} samples={shadows.samples} />
      )}

      <DevHelpers showPerspectiveHelpers={viewport.perspectiveHelpers} />
      {viewport.orbitControls && (
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          minAzimuthAngle={-Math.PI / 2}
          maxAzimuthAngle={Math.PI / 2}
        />
      )}

      <Lights />
      <OrthographicCamera
        makeDefault
        zoom={viewport.orbitControls ? 30 : 50}
        position={viewport.orbitControls ? [-15, 15, 30] : [0, 0, 0]}
        near={-100}
        far={100}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />

      {plane.enabled && <Plane color={plane.color} />}

      {!metaballs.enabled ? (
        <>
          <LiquidSphere
            scale={viewport.scale}
            position={[-8, 0, 0]}
            wireframe={renderer.wireframe}
            shaderConfig={{
              ...sharedConfig,
              fragment: {
                ...sharedConfig.fragment,
                colors: {
                  u_color_0: { value: hexToRGBA(sphere1.u_color_0) },
                  u_color_1: { value: hexToRGBA(sphere1.u_color_1) },
                  u_color_2: { value: hexToRGBA(sphere1.u_color_2) },
                },
              },
            }}
          />
          <LiquidSphere
            scale={viewport.scale}
            position={[0, 0, 0]}
            wireframe={renderer.wireframe}
            shaderConfig={{
              ...sharedConfig,
              fragment: {
                ...sharedConfig.fragment,
                colors: {
                  u_color_0: { value: hexToRGBA(sphere2.u_color_0) },
                  u_color_1: { value: hexToRGBA(sphere2.u_color_1) },
                  u_color_2: { value: hexToRGBA(sphere2.u_color_2) },
                },
              },
            }}
          />
          <LiquidSphere
            scale={viewport.scale}
            position={[8, 0, 0]}
            wireframe={renderer.wireframe}
            shaderConfig={{
              ...sharedConfig,
              fragment: {
                ...sharedConfig.fragment,
                colors: {
                  u_color_0: { value: hexToRGBA(sphere3.u_color_0) },
                  u_color_1: { value: hexToRGBA(sphere3.u_color_1) },
                  u_color_2: { value: hexToRGBA(sphere3.u_color_2) },
                },
              },
            }}
          />
        </>
      ) : (
        <MetaballEffect
          wireframe={renderer.wireframe}
          colors={[sphere1, sphere2, sphere3]}
          enabled={metaballs.enabled}
        />
      )}
    </Canvas>
  );
};

const useConfig = () => {
  const viewport = useControls("Viewport", {
    perspectiveHelpers: {
      value: false,
      label: "Perspective Helpers",
    },
    orbitControls: {
      value: true,
      label: "Camera Controls",
    },
    scale: {
      value: 3,
      min: 1,
      max: 10,
      step: 0.5,
      label: "Sphere Scale",
    },
  });
  const metaballs = useControls("Effect", {
    enabled: {
      value: false,
      label: "Use Metaballs",
    },
  });

  const renderer = useControls("Renderer", {
    wireframe: {
      value: false,
      label: "Wireframe",
    },
    powerPreference: {
      value: "high-performance",
      options: ["low-power", "high-performance", "default"],
      label: "Power Mode",
    },
    alpha: {
      value: true,
      label: "Alpha",
    },
    antialias: {
      value: true,
      label: "Antialiasing",
    },
    stencil: {
      value: true,
      label: "Stencil Buffer",
    },
    depth: {
      value: true,
      label: "Depth Buffer",
    },
  });

  const shadows = useControls("Shadows", {
    enabled: {
      value: true,
      label: "Smoothing",
    },
    size: {
      value: 10,
      min: 1,
      max: 20,
      step: 1,
      label: "Size",
    },
    samples: {
      value: 10,
      min: 1,
      max: 20,
      step: 1,
      label: "Samples",
    },
  });

  const sphere1 = useControls("Left Sphere", {
    u_color_0: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "0%",
    },
    u_color_1: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "20%",
    },
    u_color_2: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "40%",
    },
    u_color_3: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "60%",
    },
    u_color_4: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "80%",
    },
    u_color_5: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "100%",
    },
  });

  const sphere2 = useControls("Center Sphere", {
    u_color_0: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "0%",
    },
    u_color_1: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "20%",
    },
    u_color_2: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "40%",
    },
    u_color_3: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "60%",
    },
    u_color_4: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "80%",
    },
    u_color_5: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "100%",
    },
  });

  const sphere3 = useControls("Right Sphere", {
    u_color_0: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "0%",
    },
    u_color_1: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "20%",
    },
    u_color_2: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "40%",
    },
    u_color_3: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "60%",
    },
    u_color_4: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "80%",
    },
    u_color_5: {
      value: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      label: "100%",
    },
  });

  const shader = useControls({
    distortionAmount: {
      value: 0.1,
      min: 0,
      max: 0.5,
      step: 0.001,
      label: "Distortion Amount",
    },
    timeScale: {
      value: 0.14,
      min: 0,
      max: 2,
      step: 0.1,
      label: "Time Scale",
    },
    distortionWeights: {
      value: [0.5, 0.5, 0.0],
      min: 0,
      max: 1,
      step: 0.1,
      label: "Distortion Weights",
    },
    noiseScale: {
      value: 0.3,
      min: 0,
      max: 2,
      step: 0.1,
      label: "Noise Scale",
    },
    noiseSpeed: {
      value: 0.6,
      min: 0,
      max: 2,
      step: 0.1,
      label: "Noise Speed",
    },
    noiseIntensity: {
      value: 0.8,
      min: 0,
      max: 1,
      step: 0.1,
      label: "Noise Intensity",
    },
    noiseWeights: {
      value: [0.5, 0.3, 0.2],
      min: 0,
      max: 1,
      step: 0.1,
      label: "Noise Weights",
    },
    blendSoftness: {
      value: 0.6,
      min: 0,
      max: 1,
      step: 0.1,
      label: "Blend Softness",
    },
    flowSpeed: {
      value: 0.2,
      min: 0,
      max: 2,
      step: 0.1,
      label: "Flow Speed",
    },
  });

  const plane = useControls("Background", {
    enabled: {
      value: true,
      label: "Show",
    },
    color: {
      value: "#966544",
      label: "Color",
    },
  });

  return {
    viewport,
    metaballs,
    renderer,
    shadows,
    sphere1,
    sphere2,
    sphere3,
    shader,
    plane,
  };
};
