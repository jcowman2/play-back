import React from "react";
import { LevelData } from "../data/levelData";

/**
 *
 * @param {React.PropsWithChildren<{
 *  levelData: LevelData,
 *  time: number
 * }>} props
 *
 * @param { React.Ref<{
 *  restart: () => void
 * }>} ref
 */
function Stage(props, ref) {
  const { levelData, time } = props;
  const stageRef = React.useRef();

  React.useEffect(() => {
    if (!stageRef.current || !levelData) {
      return;
    }
    levelData.init(stageRef.current);
  }, [levelData, stageRef]);

  React.useEffect(() => {
    if (!levelData) {
      return;
    }
    levelData.updateForward(time);
  }, [levelData, time]);

  React.useImperativeHandle(ref, () => ({
    restart: () => {
      levelData.reset();
      levelData.init(stageRef.current);
    }
  }));

  return <div id="stageInner" ref={stageRef} />;
}

export default React.forwardRef(Stage);
