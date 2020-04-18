import React from "react";
import { LevelData } from "../data/levelData";

/**
 *
 * @param {React.PropsWithChildren<{
 *  levelData: LevelData,
 *  time: number
 * }>} props
 */
function Stage(props) {
  const { levelData, time } = props;
  const stageRef = React.createRef();

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

  return <div id="stageInner" ref={stageRef} />;
}

export default Stage;
