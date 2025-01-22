import { Grid, GizmoHelper, GizmoViewport, Stats } from "@react-three/drei";

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
