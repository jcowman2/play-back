import { Engine, Render, World, Body, Events } from "matter-js";
import { GRAVITY_X, GRAVITY_Y, GAME_BG } from "../constants";
import BodyHistory from "./bodyHistory";

const DEFAULT_WIDTH = 700;

export class LevelData {
  /** @type number */
  width;

  /** @type number */
  height;

  /** @type Matter.Engine */
  engine;

  /** @type {{ [id: string]: (t) => Matter.Body }} */
  initBodies;

  /** @type {{ [id: string]: Matter.Body }} */
  bodies;

  /** @type string[] */
  objects;

  /** @type number */
  activeObjectIndex;

  /** @type Matter.Render */
  render;

  /** @type number */
  lastRenderedTime;

  /** @type number */
  playTime;

  /** @type {{ [id: string]: Matter.Vector }}*/
  frozenVelocities;

  /** @type boolean */
  isFrozen;

  /** @type {{ enterGoal: string[] }} */
  collisions;

  /** @type {{ [id: string]: BodyHistory }} */
  histories;

  /** @type boolean */
  isReverse;

  /** @type {(data: LevelData) => void} */
  onUpdateData;

  /** @type {{ [id: string]: object }} */
  metaMap;

  /** @type string[] */
  gravityBodies;

  /** @type string[] */
  reversableBodies;

  /** @type string[] */
  interruptsBodies;

  /** @type string[] */
  fixedRotationBodies;

  /**
   *
   * @param {{ [id: string]: (t) => { body: Matter.Body, gravity: boolean }}} bodies
   * @param {string[]} objects
   * @param {{ enterGoal: string[] }} collisions
   * @param {{ width: number }} options
   */
  constructor(bodies, objects, collisions, options = {}) {
    this.width = options.width || DEFAULT_WIDTH;
    this.objects = objects;
    this.initBodies = bodies;
    this.collisions = collisions;

    this.preInit();
  }

  preInit = () => {
    this.isFrozen = false;
    this.isReverse = false;
    this.frozenVelocities = {};
    this.lastRenderedTime = 0;
    this.playTime = 0;
    this.activeObjectIndex = 0;

    this.engine = Engine.create();
    this.engine.world.gravity.scale = 0;

    this.iterateBodies();
  };

  /**
   * @param {React.ReactInstance} ref
   * @param {() => void} onEnterGoal
   * @param {(data: LevelData) => void} onUpdateData
   */
  init = (ref, onEnterGoal, onUpdateData) => {
    if (this.render) {
      return;
    }
    this.render = Render.create({
      element: ref,
      engine: this.engine,
      options: {
        wireframes: false,
        width: this.width,
        height: this.width,
        background: GAME_BG
      }
    });
    this.onUpdateData = onUpdateData;

    this.registerCollisionListener("enterGoal", onEnterGoal);
    this.registerCollisionListener("interruptReverse", this.interruptReverse);

    this.markActiveObject(this.objects[this.activeObjectIndex]);

    Render.world(this.render);
    this.freeze();
  };

  mapBodyKeyToId = bodyKey => this.bodies[bodyKey].id;

  /**
   * @param {string} key
   * @param {() => void} callback
   */
  registerCollisionListener = (key, callback) => {
    const collisions = this.collisions[key];

    let groupA;
    let groupB;

    if (Array.isArray(collisions[0])) {
      groupA = collisions[0].map(this.mapBodyKeyToId);
      groupB = collisions[1].map(this.mapBodyKeyToId);
    } else {
      groupA = collisions.map(this.mapBodyKeyToId);
      groupB = groupA;
    }

    Events.on(this.engine, "collisionStart", event => {
      for (let { bodyA, bodyB } of event.pairs) {
        if (
          (groupA.includes(bodyA.id) && groupB.includes(bodyB.id)) ||
          (groupA.includes(bodyB.id) && groupB.includes(bodyA.id))
        ) {
          return callback();
        }
      }
    });
  };

  rerender = () => {
    Render.world(this.render);
  };

  /**
   * @param {number} newTime
   */
  updateForward = newTime => {
    if (newTime === this.lastRenderedTime) {
      return;
    }

    const delta = newTime - this.lastRenderedTime;
    this.lastRenderedTime = newTime;

    if (this.isReverse) {
      this.updateReverse(delta);
    } else {
      this.updateGravity(delta);
      this.updateHistories(delta);
    }

    Engine.update(this.engine, delta);

    for (let id of this.fixedRotationBodies) {
      Body.setAngle(this.bodies[id], 0);
    }

    Render.world(this.render);

    this.onUpdateData(this);
  };

  updateGravity = delta => {
    for (let key of this.gravityBodies) {
      const body = this.bodies[key];

      if (this.isFrozen) {
        Body.setVelocity(body, { x: 0, y: 0 });
      } else {
        const force = {
          x: body.mass * ((GRAVITY_X * delta) / 1000),
          y: body.mass * ((GRAVITY_Y * delta) / 1000)
        };
        Body.applyForce(body, body.position, force);
      }
    }
  };

  updateHistories = delta => {
    if (this.isFrozen) {
      return;
    }
    this.playTime += delta;
    for (let id in this.histories) {
      this.histories[id].log(this.playTime);
    }
  };

  updateReverse = delta => {
    if (!this.isFrozen) {
      return;
    }
    this.playTime -= delta;

    if (this.playTime <= 0) {
      this.playTime = 0;
    }

    for (let id in this.histories) {
      this.histories[id].revertTo(this.playTime);
    }
  };

  normalize = unit => (unit / 100) * this.width;

  reset = () => {
    Render.stop(this.render);
    World.clear(this.engine.world);
    Engine.clear(this.engine);

    this.render.canvas.remove();
    this.render.canvas = null;
    this.render.context = null;
    this.render.textures = {};
    this.render = undefined;

    this.preInit();
  };

  nextActiveObject = () => {
    const lastIdx = this.activeObjectIndex;

    let nextIdx = this.activeObjectIndex + 1;
    if (nextIdx >= this.objects.length) {
      nextIdx = 0;
    }
    this.activeObjectIndex = nextIdx;

    const lastKey = this.objects[lastIdx];
    const newKey = this.objects[this.activeObjectIndex];

    this.unmarkObject(lastKey);
    this.markActiveObject(newKey);

    const { pushes: lastPushes } = this.metaMap[lastKey];
    const { pushes: newPushes } = this.metaMap[newKey];

    if (lastPushes === newPushes) {
      return;
    }

    if (lastPushes) {
      this.switchFromPushableObject();
    }

    if (newPushes) {
      this.switchToPushableObject();
    }
  };

  /**
   * @param {string} id
   */
  markActiveObject = id => {
    const body = this.bodies[id];
    const { selectColor } = this.metaMap[id];
    body.render.fillStyle = selectColor;
  };

  /**
   * @param {string} id
   */
  unmarkObject = id => {
    const body = this.bodies[id];
    const { color } = this.metaMap[id];
    body.render.fillStyle = color;
  };

  /**
   * @param {number} vx
   * @param {number} vy
   */
  setObjectVelocity = (vx, vy) => {
    const id = this.objects[this.activeObjectIndex];
    const { live } = this.metaMap[id];
    if (!live && !this.isFrozen) {
      return;
    }

    const body = this.bodies[id];

    if (!vx && !vy) {
      if (!body.isStatic) {
        Body.setVelocity(body, { x: 0, y: 0 });
        Body.setStatic(body, true);
      }
      return;
    }

    if (body.isStatic) {
      Body.setStatic(body, false);
    }

    const vec = {
      x: this.normalize(vx) / 1000,
      y: this.normalize(vy) / 1000
    };

    Body.setVelocity(body, vec);
  };

  /**
   * @param {number} va
   */
  setObjectAngularVelocity = va => {
    const id = this.objects[this.activeObjectIndex];
    const { live, fixedRotation } = this.metaMap[id];
    if (!live && !this.isFrozen) {
      return;
    }
    if (fixedRotation) {
      return;
    }

    const body = this.bodies[id];

    if (!va) {
      if (!body.isStatic) {
        Body.setAngularVelocity(body, 0);
        Body.setStatic(body, true);
      }
      return;
    }

    if (body.isStatic) {
      Body.setStatic(body, false);
    }

    Body.setAngularVelocity(body, va / 1000);
  };

  freeze = () => {
    if (this.isFrozen) {
      return;
    }

    this.isFrozen = true;
    const frozenVelocities = {};

    for (let id of this.gravityBodies) {
      const body = this.bodies[id];
      const { x, y } = body.velocity;

      frozenVelocities[id] = { x, y };

      Body.setVelocity(body, { x: 0, y: 0 });

      if (!this.isPushableSelected) {
        Body.setStatic(body, true);
      }
    }

    this.frozenVelocities = frozenVelocities;

    const activeId = this.objects[this.activeObjectIndex];
    const { live } = this.metaMap[activeId];
    if (!live) {
      this.markActiveObject(activeId);
    }
  };

  unfreeze = () => {
    if (!this.isFrozen) {
      return;
    }

    this.isFrozen = false;
    for (let id of this.gravityBodies) {
      const body = this.bodies[id];
      Body.setStatic(body, false);

      if (this.frozenVelocities[id]) {
        Body.setVelocity(body, this.frozenVelocities[id]);
      }
    }

    this.frozenVelocities = {};

    const activeId = this.objects[this.activeObjectIndex];
    const { live } = this.metaMap[activeId];
    if (!live) {
      this.unmarkObject(activeId);
    }
  };

  /**
   * @param {boolean} isReverse
   */
  setReverse = isReverse => {
    if (isReverse === this.isReverse) {
      return;
    }
    this.isReverse = isReverse;

    if (isReverse) {
      this.freeze();
    }

    for (let id of this.reversableBodies) {
      const body = this.bodies[id];
      Body.setStatic(body, !isReverse);
      this.bodies[id].isSensor = isReverse;
    }
  };

  interruptReverse = () => {
    if (!this.isReverse) {
      return;
    }

    this.setReverse(false);
  };

  iterateBodies = () => {
    const bodiesMap = {};
    const metaMap = {};

    const allBodies = [];
    const gravityBodies = [];
    const reversableBodies = [];
    const interruptsBodies = [];
    const fixedRotationBodies = [];

    const histories = {};

    for (let bodyId in this.initBodies) {
      const { body, meta } = this.initBodies[bodyId](this.normalize);
      const { gravity, reversable, interrupts, fixedRotation } = meta;

      if (gravity) {
        gravityBodies.push(bodyId);
      }

      if (reversable) {
        reversableBodies.push(bodyId);
        histories[bodyId] = new BodyHistory(body);
      }

      if (interrupts) {
        interruptsBodies.push(bodyId);
      }

      if (fixedRotation) {
        fixedRotationBodies.push(bodyId);
      }

      bodiesMap[bodyId] = body;
      metaMap[bodyId] = meta;
      allBodies.push(body);
    }

    this.bodies = bodiesMap;
    this.metaMap = metaMap;

    this.gravityBodies = gravityBodies;
    this.reversableBodies = reversableBodies;
    this.interruptsBodies = interruptsBodies;
    this.fixedRotationBodies = fixedRotationBodies;

    this.histories = histories;

    // Hack to allow interrupts to be generated automagically
    this.collisions.interruptReverse[1] = interruptsBodies;

    World.add(this.engine.world, allBodies);
  };

  isPushableSelected = () => {
    const id = this.objects[this.activeObjectIndex];
    const { meta } = this.metaMap[id];
    return !!meta;
  };

  switchToPushableObject = () => {
    for (let id of this.gravityBodies) {
      Body.setStatic(this.bodies[id], false);
    }
  };

  switchFromPushableObject = () => {
    for (let id of this.gravityBodies) {
      Body.setStatic(this.bodies[id], true);
    }
  };
}
