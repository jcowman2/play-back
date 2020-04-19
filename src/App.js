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
  const [animate, setAnimate] = React.useState(true);

  const [, forceUpdate] = React.useState(0);

  const toLevel = idx => {
    level.teardown();
    setLevelIdx(idx);
    setLevel(PLAYABLE_LEVELS[idx].level());
    setAnimate(true);
  };

  const handleEnterGoal = () => {
    toLevel(levelIdx + 1);
  };

  const overlayString = `${levelIdx + 1}: ${PLAYABLE_LEVELS[levelIdx].name}`;
  const monitorClass = "Monitor" + (animate ? " TurnOn" : "");
  const overlayClass = "Overlay" + (animate ? " OverlayOn" : "");

  return (
    <div className="App">
      <div className={monitorClass}>
        <div className="Screen">
          <Level
            data={level}
            onUpdateData={() => {
              forceUpdate(f => f + 1);
            }}
            onEnterGoal={handleEnterGoal}
          />
        </div>
        <div className={overlayClass} onAnimationEnd={() => setAnimate(false)}>
          {overlayString}
        </div>
      </div>

      <AdminKeyHandler onSetLevel={toLevel} />
    </div>
  );
}

export default App;
