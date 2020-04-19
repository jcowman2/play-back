import React from "react";
import Level from "./components/Level";
import { PLAYGROUND, LANDER, LANDERER, PUSH } from "./data/levels";
import AdminKeyHandler from "./components/AdminKeyHandler";

const PLAYABLE_LEVELS = [LANDER, LANDERER, PUSH];

function App() {
  const [levelIdx, setLevelIdx] = React.useState(0);
  const [level, setLevel] = React.useState(() => PLAYABLE_LEVELS[levelIdx]());

  const [, forceUpdate] = React.useState(0);

  const toLevel = idx => {
    level.teardown();
    setLevelIdx(idx);
    setLevel(PLAYABLE_LEVELS[idx]());
  };

  const handleEnterGoal = () => {
    toLevel(levelIdx + 1);
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
      <AdminKeyHandler onSetLevel={toLevel} />
    </div>
  );
}

export default App;
