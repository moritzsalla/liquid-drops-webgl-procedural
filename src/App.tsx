import { Leva } from "leva";
import "./App.css";
import { Scene } from "./components/Scene";

export const App = () => {
  return (
    <>
      <Leva
        theme={{
          sizes: {
            rootWidth: "340px",
            // controlWidth: "100px",
            // rowHeight: "24px",
            titleBarHeight: "24px",
          },
          fonts: {
            mono: "monospace",
            sans: "system-ui",
          },
        }}
      />
      <Scene />
    </>
  );
};
