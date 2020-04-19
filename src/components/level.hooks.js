import React, { useEffect } from "react";
import {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  LOOP_INTERVAL,
  OBJ_VELOCITY,
  OBJ_VELOCITY_ANGULAR
} from "../constants";

export const useTimeControl = stageRef => {
  const [time, setTime] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [loop, setLoop] = React.useState();

  const handlePause = () => {
    clearInterval(loop);
    setLoop(null);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setLoop(setInterval(() => setTime(t => t + LOOP_INTERVAL), LOOP_INTERVAL));
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      return handlePause();
    }
    return handlePlay();
  };

  const handleRestartTime = () => {
    if (isPlaying) {
      handlePause();
    }
    setTime(0);
    handlePlay();
    stageRef.current.restart();
  };

  useEffect(() => {
    console.log("hi");
    handlePlay();
  }, []);

  return { time, handlePlayPause, handleRestartTime };
};

export const useMoveControl = () => {
  const [movingUp, setMovingUp] = React.useState(false);
  const [movingDown, setMovingDown] = React.useState(false);
  const [movingLeft, setMovingLeft] = React.useState(false);
  const [movingRight, setMovingRight] = React.useState(false);

  const [rotatingCW, setRotatingCW] = React.useState(false);
  const [rotatingCCW, setRotatingCCW] = React.useState(false);

  const moveKeyEventHelper = isPress => direction => {
    switch (direction) {
      case UP:
        return setMovingUp(isPress);
      case DOWN:
        return setMovingDown(isPress);
      case LEFT:
        return setMovingLeft(isPress);
      case RIGHT:
        return setMovingRight(isPress);
      default:
        return;
    }
  };

  const handleMoveKeyPress = moveKeyEventHelper(true);
  const handleMoveKeyRelease = moveKeyEventHelper(false);

  const handleRotateKeyPress = cw =>
    cw ? setRotatingCW(true) : setRotatingCCW(true);
  const handleRotateKeyRelease = cw =>
    cw ? setRotatingCW(false) : setRotatingCCW(false);

  const objVx = OBJ_VELOCITY * ((movingRight ? 1 : 0) - (movingLeft ? 1 : 0));
  const objVy = OBJ_VELOCITY * ((movingDown ? 1 : 0) - (movingUp ? 1 : 0));
  const objVa =
    OBJ_VELOCITY_ANGULAR * ((rotatingCW ? 1 : 0) - (rotatingCCW ? 1 : 0));

  return {
    handleMoveKeyPress,
    handleMoveKeyRelease,
    handleRotateKeyPress,
    handleRotateKeyRelease,
    objVx,
    objVy,
    objVa
  };
};
