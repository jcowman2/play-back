import { LevelData } from "./levelData";
import { spirit, wall } from "./bodies";

export const PLAYGROUND = new LevelData(
  {
    spirit: spirit(50, 50, 2),
    ground: wall(50, 90, 60, 5),
    wall1: wall(20, 50, 40, 5, 0.5),
    wall2: wall(80, 30, 30, 5, -0.5)
  },
  ["ground", "wall1", "wall2"]
);
