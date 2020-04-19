import React from "react";
import Level from "./components/Level";
import { PLAYABLE_LEVELS } from "./data/levels";
import AdminKeyHandler from "./components/AdminKeyHandler";
import "./CRT.scss";

const useCRT = () => {
  const [animate, setAnimate] = React.useState(false);
  const [overlayText, setOverlayText] = React.useState(null);

  const [overlayTextDuration, setOverlayTextDuration] = React.useState(3000);

  React.useEffect(() => {
    if (!overlayText || overlayTextDuration < 0) {
      return;
    }
    setTimeout(() => setOverlayText(null), overlayTextDuration);
  }, [overlayText, overlayTextDuration]);

  const monitorClass = "Monitor" + (animate ? " TurnOn" : "");

  return {
    setAnimate,
    monitorClass,
    overlayText,
    setOverlayText,
    setOverlayTextDuration
  };
};

const formatLevelName = idx => `${idx + 1}: ${PLAYABLE_LEVELS[idx].name}`;

function App() {
  const [levelIdx, setLevelIdx] = React.useState();
  const [level, setLevel] = React.useState();
  const [, forceUpdate] = React.useState(0);
  const { setAnimate, monitorClass, overlayText, setOverlayText } = useCRT();

  const toLevel = idx => {
    if (level) {
      level.teardown();
    }

    setLevelIdx(idx);
    setLevel(PLAYABLE_LEVELS[idx].level());
    setAnimate(true);
    setOverlayText(formatLevelName(idx));
  };

  const handleEnterGoal = () => {
    toLevel(levelIdx + 1);
  };

  return (
    <div className="App">
      <div className={monitorClass} onAnimationEnd={() => setAnimate(false)}>
        <div className="Screen">
          {level && (
            <Level
              data={level}
              onUpdateData={() => {
                forceUpdate(f => f + 1);
              }}
              onEnterGoal={handleEnterGoal}
            />
          )}
        </div>
        <div className="Overlay">{overlayText}</div>
      </div>

      <AdminKeyHandler onSetLevel={toLevel} />
    </div>
  );
}

export default App;
