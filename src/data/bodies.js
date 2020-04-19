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

const COLLISION_CATEGORY = {
  spirit: 0x1,
  goal: 0x10,
  wall: 0x100,
  pusher: 0x1000,
  bound: 0x10000
};

const COLLISION_MASK = {
  spirit: 0x1111,
  goal: 0x11,
  wall: 0x1101,
  pusher: 0x11101,
  bound: 0x11000
};

export const spirit = (x, y, radius = 10) =>
  normalBody(t => ({
    body: Bodies.circle(t(x), t(y), t(radius), {
      restitution: 1,
      render: { fillStyle: SPIRIT_FILL },
      friction: 0,
      frictionAir: REGULAR_AIR_FRICTION,
      density: DENSITY_FREEZE
      // collisionFilter: {
      //   category: COLLISION_CATEGORY.spirit,
      //   mask: COLLISION_MASK.spirit
      // }
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
      // collisionFilter: {
      //   category: COLLISION_CATEGORY.goal,
      //   mask: COLLISION_MASK.goal
      // }
    }),
    meta: {}
  }));

const wallBase = ({
  live,
  color,
  selectColor,
  selectable,
  pushes,
  fixedRotation
  // collisionFilter
}) => (x, y, width, height, angle = 0, bounded = undefined) =>
  normalBody(t => ({
    body: Bodies.rectangle(t(x), t(y), t(width), t(height), {
      isStatic: true,
      angle,
      render: { fillStyle: color },
      friction: 0,
      frictionAir: 0
      // collisionFilter
      // chamfer: {}
    }),
    meta: {
      live,
      color,
      selectColor,
      selectable,
      pushes,
      fixedRotation,
      bounded
    }
  }));

export const freezeWall = wallBase({
  color: WALL_FILL_UNSELECTED,
  selectColor: WALL_FILL_SELECTED,
  selectable: true
  // collisionFilter: {
  //   category: COLLISION_CATEGORY.wall,
  //   mask: COLLISION_MASK.wall
  // }
});

export const pusherWall = wallBase({
  color: PUSHER_FILL,
  selectColor: PUSHER_FILL_SELECTED,
  selectable: true,
  fixedRotation: true,
  pushes: true
  // collisionFilter: {
  //   category: COLLISION_CATEGORY.pusher,
  //   mask: COLLISION_MASK.pusher
  // }
});

export const staticWall = wallBase({
  color: STATIC_WALL_FILL
  // collisionFilter: {
  //   category: COLLISION_CATEGORY.wall,
  //   mask: COLLISION_MASK.wall
  // }
});

export const bound = (x, y, width, height, color) =>
  normalBody(t => ({
    body: Bodies.rectangle(t(x), t(y), t(width), t(height), {
      isSensor: true,
      render: { fillStyle: color, opacity: 0.5 }
      // collisionFilter: {
      //   category: COLLISION_CATEGORY.bound,
      //   mask: COLLISION_MASK.bound
      // }
    }),
    meta: {
      color
    }
  }));
