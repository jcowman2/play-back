import { Body, Events } from "matter-js";
import {
  LEVEL_WIDTH,
  LOOP_INTERVAL,
  GRAVITY_X,
  GRAVITY_Y,
  OBJ_VELOCITY,
  OBJ_VELOCITY_ANGULAR,
  SPIRIT,
  GOAL,
  BOUND_GUTTER
} from "../constants";
import SelectableMovement from "./selectableMovement";
import BodyHistory from "./bodyHistory";

// All meta props:
// - gravity
// - reversable
// - live
// - color
// - selectable
// - selectColor
// - pushes
// - fixedRotation

const GRAVITY = "gravity";
const SELECTABLE = "selectable";
const REVERSABLE = "reversable";
const FIXED_ROTATION = "fixedRotation";

export const TRAITS = [GRAVITY, SELECTABLE, REVERSABLE, FIXED_ROTATION];

export default class BodiesManager {
  /** @type LevelApi */
  level;

  /** @type Matter.Body[] */
  all;

  /** @type {{ [key: string]: Matter.Body }} */
  bodyMap;

  /** @type {{ [key: string]: object }} */
  metaMap;

  /** @type number */
  activeObjectIndex;

  /** @type {{ [key: string]: Matter.Vector }} */
  frozenVelocities;

  /** @type {{ [key: string]: string[] }} */
  byTrait;

  /** @type SelectMovement */
  selectMovement;

  /** @type {{ [key: string]: BodyHistory }} */
  histories;

  constructor(level, bodiesInitializer) {
    this.level = level;

    const allBodies = [];
    const bodyMap = {};
    const metaMap = {};
    const histories = {};

    const byTrait = {};
    TRAITS.forEach(trait => (byTrait[trait] = []));

    for (let bodyId in bodiesInitializer) {
      const { body, meta } = bodiesInitializer[bodyId](this.normalize);
      allBodies.push(body);

      bodyMap[bodyId] = body;
      metaMap[bodyId] = meta;

      for (let trait of TRAITS) {
        if (meta[trait] !== undefined) {
          byTrait[trait].push(bodyId);
        }
      }

      if (meta[REVERSABLE]) {
        histories[bodyId] = new BodyHistory(body);
      }
    }

    this.all = allBodies;
    this.bodyMap = bodyMap;
    this.metaMap = metaMap;
    this.byTrait = byTrait;
    this.histories = histories;
  }

  start = () => {
    this.frozenVelocities = {};
    this.activeObjectIndex = 0;
    this.selectMovement = new SelectableMovement(
      this.normalize(OBJ_VELOCITY),
      OBJ_VELOCITY_ANGULAR
    );
  };

  attachEventListeners = () => {
    this.registerCollisionListener(SPIRIT, GOAL, this.level.onEnterGoal);
  };

  registerCollisionListener = (key1, key2, callback) => {
    const id1 = this.bodyMap[key1].id;
    const id2 = this.bodyMap[key2].id;

    Events.on(this.level.loop.engine, "collisionStart", event => {
      for (let { bodyA, bodyB } of event.pairs) {
        if (
          (bodyA.id === id1 && bodyB.id === id2) ||
          (bodyA.id === id2 && bodyB.id === id1)
        ) {
          return callback();
        }
      }
    });
  };

  normalize = unit => (unit / 100) * LEVEL_WIDTH;

  update = () => {
    this.updatePushes();
    this.updateGravityBodies();
    this.updateSelectables();
    this.updateHistories();
    this.updateReversables();
    this.updateFixedRotations();

    this.checkSpiritOutOfBounds();
  };

  updatePushes = () => {
    const activeId = this.level.objectSelectOrder[this.activeObjectIndex];
    const { pushes } = this.metaMap[activeId];
    const objIsStatic = !pushes && this.level.frozen;

    this.byTrait[GRAVITY].forEach(id => {
      const body = this.bodyMap[id];
      if (body.isStatic !== objIsStatic) {
        Body.setStatic(this.bodyMap[id], objIsStatic);
      }
    });
  };

  updateGravityBodies = () => {
    const clearVec = { x: 0, y: 0 };

    const bodyOperation = this.level.frozen
      ? body => {
          Body.setVelocity(body, clearVec);
        }
      : body => {
          const force = {
            x: body.mass * ((GRAVITY_X * LOOP_INTERVAL) / 1000),
            y: body.mass * ((GRAVITY_Y * LOOP_INTERVAL) / 1000)
          };
          Body.applyForce(body, body.position, force);
        };

    this.byTrait[GRAVITY].forEach(id => {
      bodyOperation(this.bodyMap[id]);
    });
  };

  updateSelectables = () => {
    const activeId = this.level.objectSelectOrder[this.activeObjectIndex];

    this.byTrait[SELECTABLE].forEach(id => {
      const body = this.bodyMap[id];
      const { color, selectColor, live, fixedRotation } = this.metaMap[id];

      const mvmt = this.selectMovement;
      if (!mvmt.isMoving() && !body.isStatic) {
        Body.setStatic(body, true);
      }

      const isSelected = id === activeId;
      const isActive = !!live !== this.level.frozen;

      let setColor = color;
      if (isSelected && isActive) {
        setColor = selectColor;
        if (mvmt.isMoving()) {
          Body.setStatic(body, false);
          Body.setVelocity(body, mvmt.getVelocity());

          if (!fixedRotation) {
            Body.setAngularVelocity(body, mvmt.getAngularVelocity());
          }
        }
      }

      body.render.fillStyle = setColor;
    });
  };

  updateHistories = () => {
    if (this.level.frozen) {
      return;
    }

    this.byTrait[REVERSABLE].forEach(id => {
      this.histories[id].log(this.level.getPlayTime());
    });
  };

  updateReversables = () => {
    if (!this.level.reversed) {
      return;
    }

    const playTime = this.level.getPlayTime();

    for (let id in this.histories) {
      this.histories[id].revertTo(playTime);
    }
  };

  updateFixedRotations = () => {
    this.byTrait[FIXED_ROTATION].forEach(id => {
      Body.setAngle(this.bodyMap[id], 0);
    });
  };

  checkSpiritOutOfBounds = () => {
    const { x, y } = this.bodyMap[SPIRIT].position;
    const min = -this.normalize(BOUND_GUTTER);
    const max = LEVEL_WIDTH + this.normalize(BOUND_GUTTER);

    const outOfBounds = x <= min || y <= min || x >= max || y >= max;
    if (outOfBounds) {
      this.level.onSpiritOutOfBounds();
    }
  };

  freeze = () => {
    const frozenVelocities = {};

    this.byTrait[GRAVITY].forEach(id => {
      const body = this.bodyMap[id];
      const { x, y } = body.velocity;

      frozenVelocities[id] = { x, y };
    });

    this.frozenVelocities = frozenVelocities;
  };

  unfreeze = () => {
    this.byTrait[GRAVITY].forEach(id => {
      const frozeV = this.frozenVelocities[id];
      if (frozeV) {
        const { x, y } = frozeV;
        Body.setVelocity(this.bodyMap[id], { x, y });
      }
    });
  };

  selectNext = () => {
    let newIdx = this.activeObjectIndex + 1;
    if (newIdx >= this.level.objectSelectOrder.length) {
      newIdx = 0;
    }
    this.activeObjectIndex = newIdx;
  };

  moveSelected = dir => {
    this.selectMovement.startMove(dir);
  };

  stopMovingSelected = dir => {
    this.selectMovement.stopMove(dir);
  };
}
