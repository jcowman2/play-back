import { Bodies } from "matter-js";
import {
  REGULAR_AIR_FRICTION,
  DENSITY_FREEZE,
  SPIRIT_FILL,
  WALL_FILL_UNSELECTED,
  GOAL_FILL,
  WALL_FILL_SELECTED,
  PUSHER_FILL,
  PUSHER_FILL_SELECTED,
  STATIC_WALL_FILL
} from "../constants";

// All meta props:
// - gravity
// - reversable
// - live
// - color
// - selectable
// - selectColor
// - pushes
// - fixedRotation
// - bounded

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
    meta: {
      gravity: true,
      reversable: true
    }
  }));

export const goal = (x, y, width) =>
  normalBody(t => ({
    body: Bodies.rectangle(t(x), t(y), t(width), t(width), {
      isStatic: true,
      isSensor: true,
      render: { fillStyle: GOAL_FILL }
    }),
    meta: {}
  }));

const wallBase = ({
  live,
  color,
  selectColor,
  selectable,
  pushes,
  fixedRotation,
  fixedPosition
}) => (x, y, width, height, angle = 0, bounded) =>
  normalBody(t => ({
    body: Bodies.rectangle(t(x), t(y), t(width), t(height), {
      isStatic: true,
      angle,
      render: { fillStyle: color },
      friction: 0,
      frictionAir: 0
    }),
    meta: {
      live,
      color,
      selectColor,
      selectable,
      pushes,
      fixedRotation,
      bounded,
      fixedPosition
    }
  }));

export const freezeWall = wallBase({
  color: WALL_FILL_UNSELECTED,
  selectColor: WALL_FILL_SELECTED,
  selectable: true
});

export const fixedFreezeWall = wallBase({
  color: WALL_FILL_UNSELECTED,
  selectColor: WALL_FILL_SELECTED,
  selectable: true,
  fixedPosition: true
});

export const pusherWall = wallBase({
  color: PUSHER_FILL,
  selectColor: PUSHER_FILL_SELECTED,
  selectable: true,
  fixedRotation: true,
  pushes: true
});

export const staticWall = wallBase({
  color: STATIC_WALL_FILL
});

export const bound = (x, y, width, height, color) =>
  normalBody(t => ({
    body: Bodies.rectangle(t(x), t(y), t(width), t(height), {
      isSensor: true,
      render: { fillStyle: color, opacity: 0.5 }
    }),
    meta: {
      color
    }
  }));
