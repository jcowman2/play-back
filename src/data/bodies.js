import { Bodies } from "matter-js";
import { LIGHT, MID_LIGHT } from "../constants";

const normalBody = func => tform => func(tform);

export const spirit = (x, y, radius = 20) =>
  normalBody(t => ({
    body: Bodies.circle(t(x), t(y), t(radius), {
      restitution: 1,
      render: { fillStyle: LIGHT },
      density: 0.00001
    }),
    gravity: true
  }));

export const wall = (x, y, width, height, angle = 0) =>
  normalBody(t => ({
    body: Bodies.rectangle(t(x), t(y), t(width), t(height), {
      isStatic: true,
      angle,
      render: { fillStyle: MID_LIGHT }
    }),
    gravity: false
  }));
