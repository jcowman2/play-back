import { Bodies } from "matter-js";
import {
  LIGHT,
  MID_LIGHT,
  REGULAR_AIR_FRICTION,
  DENSITY_FREEZE
} from "../constants";

const normalBody = func => tform => func(tform);

export const spirit = (x, y, radius = 20) =>
  normalBody(t => ({
    body: Bodies.circle(t(x), t(y), t(radius), {
      restitution: 1,
      render: { fillStyle: LIGHT },
      frictionAir: REGULAR_AIR_FRICTION,
      density: DENSITY_FREEZE
    }),
    gravity: true
  }));

export const wall = (x, y, width, height, angle = 0) =>
  normalBody(t => ({
    body: Bodies.rectangle(t(x), t(y), t(width), t(height), {
      isStatic: true,
      angle,
      render: { fillStyle: MID_LIGHT },
      friction: 0,
      frictionAir: 0
    }),
    gravity: false
  }));
