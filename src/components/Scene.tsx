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

      {viewport.debug && <DevHelpers />}
      {viewport.showControls && <OrbitControls makeDefault />}

      <Lights />
      <OrthographicCamera
        makeDefault
        zoom={50}
        position={[0, 0, 20]}
        near={-100}
        far={100}
      />
      {plane.enabled && <Plane />}

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
    debug: {
      value: true,
      label: "Debug Mode",
    },
    showControls: {
      value: true,
      label: "Orbit Controls",
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
      value: "low-power",
      options: ["low-power", "high-performance", "default"],
      label: "Power Mode",
    },
    alpha: {
      value: true,
      label: "Alpha",
    },
    antialias: {
      value: false,
      label: "Antialiasing",
    },
    stencil: {
      value: false,
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
    u_color_0: { value: "#DCC9A9", label: "0%" },
    u_color_1: { value: "#DCC9A9", label: "20%" },
    u_color_2: { value: "#EB4F1C", label: "40%" },
    u_color_3: { value: "#EB4F1C", label: "60%" },
    u_color_4: { value: "#EB8E3C", label: "80%" },
    u_color_5: { value: "#EB8E3C", label: "100%" },
  });

  const sphere2 = useControls("Center Sphere", {
    u_color_0: { value: "#DCC9A9", label: "0%" },
    u_color_1: { value: "#DCC9A9", label: "20%" },
    u_color_2: { value: "#EB4F1C", label: "40%" },
    u_color_3: { value: "#EB4F1C", label: "60%" },
    u_color_4: { value: "#EB8E3C", label: "80%" },
    u_color_5: { value: "#EB8E3C", label: "100%" },
  });

  const sphere3 = useControls("Right Sphere", {
    u_color_0: { value: "#DCC9A9", label: "0%" },
    u_color_1: { value: "#DCC9A9", label: "20%" },
    u_color_2: { value: "#EB4F1C", label: "40%" },
    u_color_3: { value: "#EB4F1C", label: "60%" },
    u_color_4: { value: "#EB8E3C", label: "80%" },
    u_color_5: { value: "#EB8E3C", label: "100%" },
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
      value: 0.2,
      min: 0,
      max: 2,
      step: 0.1,
      label: "Time Scale",
    },
    distortionWeights: {
      value: [1, 1, 1],
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
      value: 0.9,
      min: 0,
      max: 2,
      step: 0.1,
      label: "Flow Speed",
    },
  });

  const plane = useControls("Plane", {
    enabled: {
      value: true,
      label: "Show",
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
