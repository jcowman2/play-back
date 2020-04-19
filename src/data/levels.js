import { LevelData } from "./levelData";
import { spirit, freezeWall, goal } from "./bodies";
import { SPIRIT, GROUND, GOAL } from "../constants";

const DEFAULT_COLLIDER = {
  enterGoal: [SPIRIT, GOAL],
  interruptReverse: [[SPIRIT]]
};

export const PLAYGROUND = () =>
  new LevelData(
    {
      spirit: spirit(50, 50, 2),
      ground: freezeWall(50, 90, 60, 2),
      wall1: freezeWall(20, 50, 40, 2, 0.5),
      wall2: freezeWall(80, 30, 30, 2, -0.5),
      goal: goal(90, 90, 4)
    },
    [GROUND, "wall1", "wall2"],
    DEFAULT_COLLIDER
  );

export const LANDER = () =>
  new LevelData(
    {
      spirit: spirit(10, 10, 2),
      ground: freezeWall(42, 80, 80, 2),
      goal: goal(90, 90, 4)
    },
    [GROUND],
    DEFAULT_COLLIDER
  );

export const LANDERER = () =>
  new LevelData(
    {
      spirit: spirit(10, 10, 2),
      ground: freezeWall(42, 80, 30, 2),
      goal: goal(90, 90, 4)
    },
    [GROUND],
    DEFAULT_COLLIDER
  );
