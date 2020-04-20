import React from "react";
import Level from "./components/Level";
import { PLAYABLE_LEVELS } from "./data/levels";
import AdminKeyHandler from "./components/AdminKeyHandler";
import "./CRT.scss";
import "./assets/zig/zig_____.ttf";
import { SLIDES, EndSlide } from "./components/Slides";

const useCRT = () => {
  const [animate, setAnimate] = React.useState(true);
  const [overlayText, setOverlayText] = React.useState("INPUT");

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

const INSTRUCTION_OVERLAYS = [
  <div style={{ left: 400, top: 50, maxWidth: 300 }}>
    <div>Try to get the ball into the goal.</div>
    <div>Use WASD to move the platform, and QE to rotate it.</div>
    <div>Hit play/pause with SPACE.</div>
  </div>,
  <div style={{ left: 300, top: 150, maxWidth: 400 }}>
    <div>You can use time to your advantage!</div>
    <div>Press R to retry.</div>
  </div>,
  <div style={{ left: 300, top: 100, maxWidth: 400 }}>
    <div>
      Red walls can push the orb around when time is stopped, but they can't
      leave their area.
    </div>
  </div>,
  <div style={{ left: 220, top: 10, maxWidth: 400 }}>
    <div>Hold SHIFT to rewind!</div>
  </div>,
  <div style={{ left: 220, top: 10, maxWidth: 400 }}>
    <div>Press CTRL to switch control between blocks.</div>
    <div>Some blocks can only rotate in place.</div>
  </div>
];

function App() {
  const [levelIdx, setLevelIdx] = React.useState();
  const [level, setLevel] = React.useState();
  const [, forceUpdate] = React.useState(0);
  const [slideIdx, setSlideIdx] = React.useState(0);

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
    if (levelIdx === PLAYABLE_LEVELS.length - 1) {
      setLevel(null);
      setSlideIdx(-1);
    } else {
      toLevel(levelIdx + 1);
    }
  };

  const handleAnyKey = () => {
    if (level) {
      return;
    }
    if (slideIdx === SLIDES.length - 1) {
      toLevel(0);
    } else {
      setSlideIdx(i => i + 1);
    }
  };

  const totalRetries = 0;

  const Slide =
    slideIdx < 0 ? (
      <EndSlide totalRetries={totalRetries} />
    ) : (
      SLIDES[slideIdx]()
    );

  return (
    <div className="App">
      <div className={monitorClass} onAnimationEnd={() => setAnimate(false)}>
        <div className="Screen">
          {level ? (
            <>
              <div className="InstructionOverlay">
                {INSTRUCTION_OVERLAYS[levelIdx]}
              </div>
              <Level
                data={level}
                onUpdateData={() => {
                  forceUpdate(f => f + 1);
                }}
                onEnterGoal={handleEnterGoal}
              />
            </>
          ) : (
            Slide
          )}
        </div>
        <div className="Overlay">{overlayText}</div>
      </div>

      <AdminKeyHandler onSetLevel={toLevel} onAnyKey={handleAnyKey} />
    </div>
  );
}

export default App;
