import { Grid, GizmoHelper, GizmoViewport, Stats } from "@react-three/drei";

export const DevHelpers = ({
  showPerspectiveHelpers,
}: {
  showPerspectiveHelpers: boolean;
}) => {
  return (
    <>
      {showPerspectiveHelpers && (
        <>
          <Grid
            args={[25, 10]}
            cellSize={2}
            cellThickness={1}
            cellColor="black"
            sectionSize={2}
          />
          <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
            <GizmoViewport
              axisColors={["red", "green", "blue"]}
              labelColor="black"
            />
          </GizmoHelper>
        </>
      )}
      <Stats />
    </>
  );
};
