import React from "react";
import LevelKeyHandler from "./LevelKeyHandler";

/**
 *
 * @param {React.PropsWithChildren<{
 *  data: LevelApi,
 *  onEnterGoal: () => void,
 *  onUpdateData: (data: LevelData) => void
 * }>} props
 */
function Level(props) {
  const { data: level, onEnterGoal } = props;
  const stageRef = React.useRef();

  React.useEffect(() => {
    if (!stageRef.current || !level || level.initialized) {
      return;
    }
    level.init(stageRef.current, () => {
      onEnterGoal();
    });
    level.start();
  }, [stageRef, level, onEnterGoal]);

  return (
    <>
      <div id="stageInner" ref={stageRef} />
      <LevelKeyHandler onGameEvent={level.handleGameKeyEvent} />
    </>
  );
}

export default Level;
