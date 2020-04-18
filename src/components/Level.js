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
  const [frozen, setFrozen] = React.useState(true);

  const { time, handlePlayPause, handleRestart } = useTimeControl(stageRef);
  const {
    handleMoveKeyPress,
    handleMoveKeyRelease,
    handleRotateKeyPress,
    handleRotateKeyRelease,
    objVx,
    objVy,
    objVa
  } = useMoveControl();

  const handleToggleSelected = () => {
    stageRef.current.nextObject();
  };

  const handleFreeze = () => {
    stageRef.current.freeze();
    setFrozen(true);
  };

  const handleFreezeUnfreeze = () => {
    if (frozen) {
      stageRef.current.unfreeze();
      return setFrozen(false);
    }
    handleFreeze();
  };

  return (
    <>
      <Stage
        ref={stageRef}
        levelData={data}
        time={time}
        objVx={objVx}
        objVy={objVy}
        objVa={objVa}
      />
      <LevelKeyHandler
        onFreezeUnfreeze={handleFreezeUnfreeze}
        onRestart={() => {
          handleFreeze();
          handleRestart();
        }}
        onToggleSelected={handleToggleSelected}
        onMoveKeyPress={handleMoveKeyPress}
        onMoveKeyRelease={handleMoveKeyRelease}
        onRotateKeyPress={handleRotateKeyPress}
        onRotateKeyRelease={handleRotateKeyRelease}
      />
    </>
  );
}

export default Level;
