import React from "react";

export const useLevelDataTriggers = (
  levelData,
  time,
  stageRef,
  objVx,
  objVy,
  objVa
) => {
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

  React.useEffect(() => {
    if (!levelData || objVx === undefined || objVy === undefined) {
      return;
    }
    levelData.setObjectVelocity(objVx, objVy);
  }, [levelData, objVx, objVy]);

  React.useEffect(() => {
    if (!levelData || objVa === undefined) {
      return;
    }
    levelData.setObjectAngularVelocity(objVa);
  }, [levelData, objVa]);
};
