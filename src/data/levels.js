import { LevelData } from "./levelData";
import { spirit, freezeWall, goal } from "./bodies";

const SPIRIT = "spirit";
const GROUND = "ground";
const GOAL = "goal";

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
    {
      enterGoal: [SPIRIT, GOAL],
      interruptReverse: [[SPIRIT]]
    }
  );
