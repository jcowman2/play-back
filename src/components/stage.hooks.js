import React from "react";

export const useLevelDataUpdater = (
  levelData,
  stageRef,
  time,
  onEnterGoal,
  onUpdateData
) => {
  const [needsInit, setNeedsInit] = React.useState(true);
  const [lastTime, setLastTime] = React.useState(0);

  React.useEffect(() => {
    if (!stageRef.current || !levelData || !needsInit) {
      return;
    }
    setNeedsInit(false);
    levelData.init(stageRef.current, onEnterGoal, onUpdateData);
  }, [levelData, stageRef, needsInit, onEnterGoal, onUpdateData]);

  React.useEffect(() => {
    if (!levelData || lastTime === time) {
      return;
    }

    setLastTime(time);
    levelData.updateForward(time);
  }, [levelData, time, lastTime]);
};

export const useBlockMovers = (levelData, objVx, objVy, objVa) => {
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
