import React from "react";
import LevelKeyHandler from "./_LevelKeyHandler";

/**
 *
 * @param {React.PropsWithChildren<{
 *  data: LevelApi,
 *  onUpdateData: (data: LevelData) => void
 * }>} props
 */
function Level(props) {
  const { data: level } = props;
  const stageRef = React.useRef();

  React.useEffect(() => {
    if (!stageRef.current || !level || level.initialized) {
      return;
    }
    level.init(stageRef.current, () => {
      console.log("YOU MADE IT TO THE GOAL!");
      level.restart();
    });
    level.start();
  }, [stageRef, level]);

  return (
    <>
      <div id="stageInner" ref={stageRef} />
      <LevelKeyHandler onGameEvent={level.handleGameKeyEvent} />
    </>
  );
}

export default Level;
