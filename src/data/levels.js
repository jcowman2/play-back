import {
  spirit,
  freezeWall,
  goal,
  staticWall,
  pusherWall,
  bound
} from "./bodies";
import { GROUND, PUSHER, PUSHER_FILL } from "../constants";
import LevelApi from "./levelApi";

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
  );

export const LANDER = () =>
  new LevelApi(
    {
      spirit: spirit(10, 10, 2),
      ground: freezeWall(42, 80, 80, 2),
      goal: goal(90, 90, 4)
    },
    [GROUND]
  );

export const LANDERER = () =>
  new LevelApi(
    {
      spirit: spirit(10, 10, 2),
      ground: freezeWall(42, 80, 30, 2),
      goal: goal(90, 90, 4)
    },
    [GROUND]
  );

export const PUSH = () =>
  new LevelApi(
    {
      goal: goal(90, 90, 4),
      spirit: spirit(20, 10, 2),
      pusherBound: bound(45, 60, 80, 10, PUSHER_FILL),
      pusher: pusherWall(10, 60, 8, 8, 0, "pusherBound"),
      ground: staticWall(20, 30, 30, 2, 0.5)
    },
    [PUSHER]
  );

export const PLAYABLE_LEVELS = [
  { name: "Lander", level: LANDER },
  { name: "Landerer", level: LANDERER },
  { name: "Push", level: PUSH }
];
