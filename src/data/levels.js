import { LevelData } from "./levelData";
import { Bodies } from "matter-js";

export const PLAYGROUND = new LevelData({
  spirit: Bodies.circle(200, 200, 20, {
    restitution: 1.5,
    render: { fillStyle: "white" }
  }),
  ground: Bodies.rectangle(300, 500, 810, 60, {
    isStatic: true,
    angle: 0.5
  })
});
