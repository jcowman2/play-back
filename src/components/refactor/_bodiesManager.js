import { Body } from "matter-js";
import {
  LEVEL_WIDTH,
  LOOP_INTERVAL,
  GRAVITY_X,
  GRAVITY_Y,
  OBJ_VELOCITY,
  OBJ_VELOCITY_ANGULAR
} from "../../constants";
import SelectableMovement from "./_selectableMovement";

// All meta props:
// - gravity
// - reversable
// - live
// - color
// - selectable
// - selectColor
// - interrupts
// - pushes
// - fixedRotation

const GRAVITY = "gravity";
const SELECTABLE = "selectable";

export const TRAITS = [GRAVITY, SELECTABLE];

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

  constructor(level, bodiesInitializer) {
    this.level = level;

    const allBodies = [];
    const bodyMap = {};
    const metaMap = {};

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
    }

    this.all = allBodies;
    this.bodyMap = bodyMap;
    this.metaMap = metaMap;
    this.byTrait = byTrait;
  }

  start = () => {
    this.frozenVelocities = {};
    this.activeObjectIndex = 0;
    this.selectMovement = new SelectableMovement(
      this.normalize(OBJ_VELOCITY),
      OBJ_VELOCITY_ANGULAR
    );
  };

  normalize = unit => (unit / 100) * LEVEL_WIDTH;

  update = () => {
    this.updatePushes();
    this.updateGravityBodies();
    this.updateSelectables();
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
      const { color, selectColor, live } = this.metaMap[id];

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
          Body.setAngularVelocity(body, mvmt.getAngularVelocity());
        }
      }

      body.render.fillStyle = setColor;
    });
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
