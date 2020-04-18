import React from "react";
import { useLevelDataTriggers } from "./stage.hooks";

/**
 *
 * @param {React.PropsWithChildren<{
 *  levelData: LevelData,
 *  time: number,
 *  objVx: number,
 *  objVy: number,
 *  objVa: number
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
  const { levelData, time, objVx, objVy, objVa } = props;
  const stageRef = React.useRef();

  useLevelDataTriggers(levelData, time, stageRef, objVx, objVy, objVa);

  React.useImperativeHandle(ref, () => ({
    restart: () => {
      levelData.reset();
      levelData.init(stageRef.current);
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
