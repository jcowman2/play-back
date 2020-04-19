import { Bodies } from "matter-js";
import {
  REGULAR_AIR_FRICTION,
  DENSITY_FREEZE,
  SPIRIT_FILL,
  WALL_FILL_UNSELECTED,
  GOAL_FILL
} from "../constants";

const normalBody = func => tform => func(tform);

export const spirit = (x, y, radius = 10) =>
  normalBody(t => ({
    body: Bodies.circle(t(x), t(y), t(radius), {
      restitution: 1,
      render: { fillStyle: SPIRIT_FILL },
      friction: 0,
      frictionAir: REGULAR_AIR_FRICTION,
      density: DENSITY_FREEZE
    }),

    gravity: true,
    reversable: true
  }));

export const wall = (x, y, width, height, angle = 0) =>
  normalBody(t => ({
    body: Bodies.rectangle(t(x), t(y), t(width), t(height), {
      isStatic: true,
      angle,
      render: { fillStyle: WALL_FILL_UNSELECTED },
      friction: 0,
      frictionAir: 0
    })
  }));

export const goal = (x, y, width) =>
  normalBody(t => ({
    body: Bodies.rectangle(t(x), t(y), t(width), t(width), {
      isStatic: true,
      isSensor: true,
      render: { fillStyle: GOAL_FILL }
    })
  }));
