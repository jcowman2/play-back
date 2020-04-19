import { LevelData } from "./levelData";
import { spirit, freezeWall, goal, staticWall, pusherWall } from "./bodies";
import { SPIRIT, GROUND, GOAL, PUSHER } from "../constants";
import LevelApi from "../components/refactor/_levelApi";

const DEFAULT_COLLIDER = {
  enterGoal: [SPIRIT, GOAL],
  interruptReverse: [[SPIRIT]]
};

export const PLAYGROUND = () =>
  new LevelApi(
    {
      spirit: spirit(50, 50, 2),
      ground: freezeWall(50, 90, 60, 2),
      wall1: freezeWall(20, 50, 40, 2, 0.5),
      wall2: freezeWall(80, 30, 30, 2, -0.5),
      pusher: pusherWall(20, 80, 8, 8),
      goal: goal(90, 90, 4)
    },
    [GROUND, "wall1", "wall2", PUSHER]
    // DEFAULT_COLLIDER
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

export const PUSH = () =>
  new LevelData(
    {
      spirit: spirit(20, 10, 2),
      pusher: pusherWall(10, 30, 8, 8),
      ground: staticWall(20, 30, 30, 30, 0.5),
      goal: goal(90, 90, 4)
    },
    [PUSHER],
    DEFAULT_COLLIDER
  );
