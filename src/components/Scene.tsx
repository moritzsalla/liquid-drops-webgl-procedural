import {
  OrbitControls,
  OrthographicCamera,
  SoftShadows,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { DevHelpers, Lights, LiquidSphere, Plane } from "./Elements";

const DEBUG = true;
const CONTROLS = true;
const SCALE = 3;

export const Scene = () => {
  return (
    <Canvas
      shadows
      gl={{
        powerPreference: "low-power",
        alpha: true,
        antialias: false,
        stencil: false,
        depth: true,
      }}
    >
      <SoftShadows size={10} samples={10} />

      {DEBUG && <DevHelpers />}
      {CONTROLS && <OrbitControls />}

      <Lights />
      <OrthographicCamera makeDefault zoom={50} position={[0, 0, 20]} />
      <Plane />

      <LiquidSphere
        scale={SCALE}
        position={[-8, 0, 0]}
        colors={{
          u_color_0: { value: [0.866, 0.788, 0.663, 1.0] },
          u_color_1: { value: [0.92, 0.31, 0.11, 1.0] },
          u_color_2: { value: [0.92, 0.556, 0.24, 1.0] },
        }}
      />
      <LiquidSphere
        scale={SCALE}
        position={[0, 0, 0]}
        colors={{
          u_color_0: { value: [0.098, 0.152, 0.298, 1.0] }, // Deep blue
          u_color_1: { value: [0.454, 0.247, 0.611, 1.0] }, // Purple
          u_color_2: { value: [0.831, 0.384, 0.882, 1.0] }, // Bright magenta
        }}
      />
      <LiquidSphere
        scale={SCALE}
        position={[8, 0, 0]}
        colors={{
          u_color_0: { value: [0.086, 0.407, 0.407, 1.0] }, // Teal
          u_color_1: { value: [0.125, 0.478, 0.635, 1.0] }, // Ocean blue
          u_color_2: { value: [0.184, 0.831, 0.886, 1.0] }, // Bright cyan
        }}
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
