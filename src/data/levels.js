import {
  spirit,
  freezeWall,
  goal,
  staticWall,
  pusherWall,
  bound,
  fixedFreezeWall
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

export const TOWER = () =>
  new LevelApi(
    {
      goal: goal(50, 20, 4),
      spirit: spirit(20, 10, 2),
      pusherBound: bound(50, 90, 90, 10, PUSHER_FILL),
      pusher: pusherWall(90, 90, 8, 8, 0, "pusherBound"),
      wall1: staticWall(50, 10, 24, 2),
      wall2: staticWall(39, 45, 2, 70),
      wall3: staticWall(61, 45, 2, 70)
    },
    [PUSHER]
  );

export const PLATEAU = () =>
  new LevelApi(
    {
      goal: goal(20, 80, 4),
      spirit: spirit(10, 5, 2),
      topWall: fixedFreezeWall(40, 30, 70, 2),
      goalShield: staticWall(20, 65, 50, 2, -0.5),
      pusherBound: bound(80, 80, 38, 38, PUSHER_FILL),
      pusher: pusherWall(90, 90, 8, 8, 0, "pusherBound")
    },
    ["topWall", PUSHER]
  );

export const PLAYABLE_LEVELS = [
  { name: "Lander", level: LANDER },
  { name: "Landerer", level: LANDERER },
  { name: "Push", level: PUSH },
  { name: "Tower", level: TOWER },
  { name: "Plateau", level: PLATEAU }
];
