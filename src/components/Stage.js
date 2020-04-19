import React from "react";
import { useBlockMovers, useLevelDataUpdater } from "./stage.hooks";

/**
 *
 * @param {React.PropsWithChildren<{
 *  levelData: LevelData,
 *  time: number,
 *  objVx: number,
 *  objVy: number,
 *  objVa: number,
 *  onEnterGoal: () => void
 * }>} props
 *
 * @param { React.Ref<{
 *  restart: () => void,
 *  nextObject: () => void,
 *  freeze: () => void,
 *  unfreeze: () => void
 * }>} ref
 */
function Stage(props, ref) {
  const { levelData, time, objVx, objVy, objVa, onEnterGoal } = props;
  const stageRef = React.useRef();

  useLevelDataUpdater(levelData, stageRef, time, onEnterGoal);
  useBlockMovers(levelData, objVx, objVy, objVa);

  React.useImperativeHandle(ref, () => ({
    restart: () => {
      levelData.reset();
      levelData.init(stageRef.current, onEnterGoal);
    },
    nextObject: () => {
      levelData.nextActiveObject();
      levelData.rerender();
    },
    freeze: () => {
      levelData.freeze();
    },
    unfreeze: () => {
      levelData.unfreeze();
    }
  }));

  return <div id="stageInner" ref={stageRef} />;
}

export default React.forwardRef(Stage);
