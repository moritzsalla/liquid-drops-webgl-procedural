import {
  OrbitControls,
  OrthographicCamera,
  SoftShadows,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { DevHelpers, Lights, LiquidSphere, Plane } from "./Elements";
import { useControls } from "leva";
import { useMemo } from "react";

const hexToRGBA = (hex: string): [number, number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b, 1];
};

export const Scene = () => {
  const viewport = useControls("viewport", {
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

  const renderer = useControls("renderer", {
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

  const shadows = useControls("shadows", {
    enabled: {
      value: true,
      label: "Enable Shadow Softness",
    },
    size: {
      value: 10,
      min: 1,
      max: 20,
      step: 1,
      label: "Shadow Size",
    },
    samples: {
      value: 10,
      min: 1,
      max: 20,
      step: 1,
      label: "Shadow Samples",
    },
  });

  const sphere1 = useControls("sphere1", {
    u_color_0: { value: "#DCC9A9", label: "Base" },
    u_color_1: { value: "#EB4F1C", label: "Mid" },
    u_color_2: { value: "#EB8E3C", label: "Highlight" },
  });

  const sphere2 = useControls("sphere2", {
    u_color_0: { value: "#1A2749", label: "Base" },
    u_color_1: { value: "#744B9F", label: "Mid" },
    u_color_2: { value: "#D461E2", label: "Highlight" },
  });

  const sphere3 = useControls("sphere3", {
    u_color_0: { value: "#16686A", label: "Base" },
    u_color_1: { value: "#207AA2", label: "Mid" },
    u_color_2: { value: "#2FD4E2", label: "Highlight" },
  });

  const shader = useControls({
    distortionAmount: {
      value: 0.095,
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
      value: 0.5,
      min: 0,
      max: 2,
      step: 0.1,
      label: "Noise Speed",
    },
    noiseIntensity: {
      value: 0.7,
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
      value: 0.4,
      min: 0,
      max: 1,
      step: 0.1,
      label: "Blend Softness",
    },
    flowSpeed: {
      value: 0.4,
      min: 0,
      max: 2,
      step: 0.1,
      label: "Flow Speed",
    },
  });

  const shaderConfig = useMemo(
    () => ({
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
    }),
    [shader]
  );

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
      {viewport.showControls && <OrbitControls />}

      <Lights />
      <OrthographicCamera makeDefault zoom={50} position={[0, 0, 20]} />
      <Plane />

      <LiquidSphere
        scale={viewport.scale}
        position={[-8, 0, 0]}
        colors={{
          u_color_0: { value: hexToRGBA(sphere1.u_color_0) },
          u_color_1: { value: hexToRGBA(sphere1.u_color_1) },
          u_color_2: { value: hexToRGBA(sphere1.u_color_2) },
        }}
        wireframe={renderer.wireframe}
        shaderConfig={shaderConfig}
      />
      <LiquidSphere
        scale={viewport.scale}
        position={[0, 0, 0]}
        colors={{
          u_color_0: { value: hexToRGBA(sphere2.u_color_0) },
          u_color_1: { value: hexToRGBA(sphere2.u_color_1) },
          u_color_2: { value: hexToRGBA(sphere2.u_color_2) },
        }}
        wireframe={renderer.wireframe}
        shaderConfig={shaderConfig}
      />
      <LiquidSphere
        scale={viewport.scale}
        position={[8, 0, 0]}
        colors={{
          u_color_0: { value: hexToRGBA(sphere3.u_color_0) },
          u_color_1: { value: hexToRGBA(sphere3.u_color_1) },
          u_color_2: { value: hexToRGBA(sphere3.u_color_2) },
        }}
        wireframe={renderer.wireframe}
        shaderConfig={shaderConfig}
      />

      {/* <PostProcessing /> */}
    </Canvas>
  );
};

// const PostProcessing = () => {
//   return (
//     <EffectComposer>
//       <Noise
//         premultiply={true} // Ensures noise is multiplied with the input color
//         blendFunction={BlendFunction.SOFT_LIGHT} // Sets the blend mode to "darken"
//         opacity={1} // Adjust opacity as needed
//       />
//     </EffectComposer>
//   );
// };
