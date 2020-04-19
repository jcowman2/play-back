import { LevelData } from "./levelData";
import { spirit, wall, goal } from "./bodies";

export const PLAYGROUND = () =>
  new LevelData(
    {
      spirit: spirit(50, 50, 2),
      ground: wall(50, 90, 60, 2),
      wall1: wall(20, 50, 40, 2, 0.5),
      wall2: wall(80, 30, 30, 2, -0.5),
      goal: goal(90, 90, 4)
    },
    ["ground", "wall1", "wall2"],
    {
      enterGoal: ["spirit", "goal"]
    }
  );
