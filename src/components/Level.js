import React from "react";
import Stage from "./Stage";
import LevelKeyHandler from "./LevelKeyHandler";
import { useTimeControl, useMoveControl } from "./level.hooks";

/**
 *
 * @param {React.PropsWithChildren<{
 *  data: LevelData,
 * }>} props
 */
function Level(props) {
  const { data } = props;

  const stageRef = React.useRef();
  const { time, handlePlayPause, handleRestart } = useTimeControl(stageRef);
  const {
    handleMoveKeyPress,
    handleMoveKeyRelease,
    objVx,
    objVy
  } = useMoveControl();

  const handleToggleSelected = () => {
    stageRef.current.nextObject();
  };

  return (
    <>
      <Stage
        ref={stageRef}
        levelData={data}
        time={time}
        objVx={objVx}
        objVy={objVy}
      />
      <LevelKeyHandler
        onPlayPause={handlePlayPause}
        onRestart={handleRestart}
        onToggleSelected={handleToggleSelected}
        onMoveKeyPress={handleMoveKeyPress}
        onMoveKeyRelease={handleMoveKeyRelease}
      />
    </>
  );
}

export default Level;
