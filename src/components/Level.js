import React from "react";
import Stage from "./Stage";
import LevelKeyHandler from "./LevelKeyHandler";
import { useTimeControl, useMoveControl } from "./level.hooks";

/**
 *
 * @param {React.PropsWithChildren<{
 *  data: LevelData,
 *  onUpdateData: (data: LevelData) => void
 * }>} props
 */
function Level(props) {
  const { data, onUpdateData } = props;

  const stageRef = React.useRef();
  const [frozen, setFrozen] = React.useState(true);

  const { time, handlePlayPause, handleRestartTime } = useTimeControl(stageRef);
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

  const handleRestart = () => {
    handleFreeze();
    handleRestartTime();
  };

  const handleEnterGoal = () => {
    console.log("YOU GOT TO THE GOAL!");
    handleRestart();
  };

  const handleReverseKeyPress = () => {
    stageRef.current.setReverse(true);
  };

  const handleReverseKeyRelease = () => {
    stageRef.current.setReverse(false);
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
        onEnterGoal={handleEnterGoal}
        onUpdateData={onUpdateData}
      />
      <LevelKeyHandler
        onFreezeUnfreeze={handleFreezeUnfreeze}
        onRestart={handleRestart}
        onToggleSelected={handleToggleSelected}
        onMoveKeyPress={handleMoveKeyPress}
        onMoveKeyRelease={handleMoveKeyRelease}
        onRotateKeyPress={handleRotateKeyPress}
        onRotateKeyRelease={handleRotateKeyRelease}
        onReverseKeyPress={handleReverseKeyPress}
        onReverseKeyRelease={handleReverseKeyRelease}
      />
    </>
  );
}

export default Level;
