import { LevelData } from "./levelData";
import { spirit, wall } from "./bodies";

export const PLAYGROUND = new LevelData({
  spirit: spirit(50, 50, 2),
  ground: wall(50, 90, 60, 5)
});
