import React from "react";
import Level from "./components/Level";
import { PLAYABLE_LEVELS } from "./data/levels";
import AdminKeyHandler from "./components/AdminKeyHandler";
import "./CRT.scss";

function App() {
  const [levelIdx, setLevelIdx] = React.useState(0);
  const [level, setLevel] = React.useState(() =>
    PLAYABLE_LEVELS[levelIdx].level()
  );

  const [, forceUpdate] = React.useState(0);

  const toLevel = idx => {
    level.teardown();
    setLevelIdx(idx);
    setLevel(PLAYABLE_LEVELS[idx].level());
  };

  const handleEnterGoal = () => {
    toLevel(levelIdx + 1);
  };

  const overlayString = `${levelIdx + 1}: ${PLAYABLE_LEVELS[levelIdx].name}`;

  return (
    <div className="App">
      <div className="Monitor TurnOn">
        <div className="Screen">
          <Level
            data={level}
            onUpdateData={() => {
              forceUpdate(f => f + 1);
            }}
            onEnterGoal={handleEnterGoal}
          />
        </div>
        <div class="Overlay">{overlayString}</div>
      </div>

      <AdminKeyHandler onSetLevel={toLevel} />
    </div>
  );
}

export default App;
