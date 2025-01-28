import { extend, useFrame, type Object3DNode } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes";
import { VERTEX_SHADER, FRAGMENT_SHADER } from "../shaders/sphereShaders";

extend({ MarchingCubes });

declare module "@react-three/fiber" {
  interface ThreeElements {
    marchingCubes: Object3DNode<MarchingCubes, typeof MarchingCubes>;
  }
}

export const MetaballEffect = () => {
  const meshRef = useRef<MarchingCubes>(null);
  const ballPositions = useRef([
    new THREE.Vector3(0.8, 0.4, 0.4),
    new THREE.Vector3(0.24, 0.5, 0.5),
    new THREE.Vector3(0.2, 0.55, 0.55),
  ]);
  const uniforms = useRef({
    u_resolution: { value: [window.innerWidth, window.innerHeight] },
    u_time: { value: 0 },
    u_time_offset: { value: Math.random() * 100 }, // Random offset for variation
    u_distortionAmount: { value: 0.2 }, // Increased for visibility
    u_timeScale: { value: 1.0 }, // Increased for more obvious movement
    u_distortionWeights: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
    u_merge: { value: false },
    u_mergeProgress: { value: 0.0 },
    u_targetPosition: { value: new THREE.Vector3() },
    u_sphereIndex: { value: 0 },
    u_noiseScale: { value: 1.0 },
    u_noiseSpeed: { value: 1.0 },
    u_noiseIntensity: { value: 0.5 },
    u_noiseWeights: { value: new THREE.Vector3(0.5, 0.3, 0.2) },
    u_blendSoftness: { value: 0.1 },
    u_flowSpeed: { value: 1.0 },
    u_offset: { value: new THREE.Vector2(0, 0) },
    u_camera_position: { value: new THREE.Vector3() },
    u_light_position: { value: new THREE.Vector3(-40, 40, 10) },

    // Ball 1 gradient (Deep Red to Bright Red)
    u_color_0_start: { value: new THREE.Vector4(0.5, 0, 0, 1) },
    u_color_0_end: { value: new THREE.Vector4(1, 0, 0, 1) },

    // Ball 2 gradient (Deep Green to Bright Green)
    u_color_1_start: { value: new THREE.Vector4(0, 0.5, 0, 1) },
    u_color_1_end: { value: new THREE.Vector4(0, 1, 0, 1) },

    // Ball 3 gradient (Deep Blue to Bright Blue)
    u_color_2_start: { value: new THREE.Vector4(0, 0, 0.5, 1) },
    u_color_2_end: { value: new THREE.Vector4(0, 0, 1, 1) },

    u_ball1_pos: { value: ballPositions.current[0] },
    u_ball2_pos: { value: ballPositions.current[1] },
    u_ball3_pos: { value: ballPositions.current[2] },
  });

  useFrame((state) => {
    if (!meshRef.current) return;

    meshRef.current.reset();

    // Animate the ball position using time
    const time = state.clock.elapsedTime;

    // Different subtract values will create different visual effects
    ballPositions.current.forEach((pos, index) => {
      meshRef.current?.addBall(pos.x, pos.y, pos.z, 0.5, 1);
      // Update the uniform for this ball's position
      uniforms.current[`u_ball${index + 1}_pos`].value.copy(pos);
    });
    meshRef.current.update();

    uniforms.current.u_time.value = time;
    uniforms.current.u_camera_position.value.copy(state.camera.position);
  });

  return (
    <marchingCubes
      ref={meshRef}
      args={[
        28 * 2,
        new THREE.ShaderMaterial({
          wireframe: false,
          uniforms: uniforms.current,
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
        }),
        true,
        true,
      ]}
      isolation={50}
      scale={10}
    />
  );
};
