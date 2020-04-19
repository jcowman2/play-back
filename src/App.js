import React from "react";
import Level from "./components/refactor/_Level";
// import Level from "./components/Level";
import Debug from "./components/Debug";
import { PLAYGROUND, LANDER, LANDERER, PUSH } from "./data/levels";

const PLAYABLE_LEVELS = [LANDER, LANDERER, PUSH];

function App() {
  // const level = React.useRef(LANDERER());
  const [levelIdx, setLevelIdx] = React.useState(0);
  const [level, setLevel] = React.useState(PLAYABLE_LEVELS[levelIdx]());

  const [, forceUpdate] = React.useState(0);

  const handleEnterGoal = () => {
    setLevelIdx(levelIdx + 1);
    setLevel(PLAYABLE_LEVELS[levelIdx + 1]());
  };

  return (
    <div className="App">
      <Level
        data={level}
        onUpdateData={() => {
          forceUpdate(f => f + 1);
        }}
        onEnterGoal={handleEnterGoal}
      />
      {/* <Debug data={level.current} /> */}
    </div>
  );
}

export default App;
