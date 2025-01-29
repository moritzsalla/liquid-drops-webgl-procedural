export const Lights = () => {
  return (
    <>
      {/* Main directional light */}
      <directionalLight
        position={[0, 0, 3]}
        intensity={1.0}
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
      {/* <ambientLight intensity={1.0} /> */}
    </>
  );
};
