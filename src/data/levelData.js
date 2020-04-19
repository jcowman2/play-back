import { Engine, Render, World, Body, Events } from "matter-js";
import {
  GRAVITY_X,
  GRAVITY_Y,
  DENSITY_FREEZE,
  DENSITY_UNFREEZE,
  WALL_FILL_SELECTED,
  WALL_FILL_UNSELECTED,
  GAME_BG
} from "../constants";
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

  /** @type string[] */
  gravityBodies;

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

  /** @type string[] */
  reversableBodies;

  /** @type {{ [id: string]: BodyHistory }} */
  histories;

  /** @type boolean */
  isReverse;

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
    this.frozenVelocities = {};
    this.lastRenderedTime = 0;
    this.playTime = 0;
    this.activeObjectIndex = 0;

    this.engine = Engine.create();
    this.engine.world.gravity.scale = 0;

    const bodiesMap = {};
    const allBodies = [];
    const gravityBodies = [];
    const reversableBodies = [];
    const histories = {};

    for (let bodyId in this.initBodies) {
      const { body, gravity, reversable } = this.initBodies[bodyId](
        this.normalize
      );

      if (gravity) {
        gravityBodies.push(bodyId);
      }
      if (reversable) {
        reversableBodies.push(bodyId);
        histories[bodyId] = new BodyHistory(body);
      }

      bodiesMap[bodyId] = body;
      allBodies.push(body);
    }

    this.bodies = bodiesMap;
    this.gravityBodies = gravityBodies;
    this.reversableBodies = reversableBodies;
    this.histories = histories;

    World.add(this.engine.world, allBodies);
  };

  /**
   * @param {React.ReactInstance} ref
   * @param {() => void} onEnterGoal
   */
  init = (ref, onEnterGoal) => {
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

    this.registerCollisionListener("enterGoal", onEnterGoal);

    this.markActiveObject(this.objects[this.activeObjectIndex]);

    Render.world(this.render);
    this.freeze();
  };

  /**
   * @param {string} key
   * @param {() => void} callback
   */
  registerCollisionListener = (key, callback) => {
    const ids = this.collisions[key].map(bodyKey => this.bodies[bodyKey].id);

    Events.on(this.engine, "collisionStart", event => {
      for (let { bodyA, bodyB } of event.pairs) {
        if (ids.includes(bodyA.id) && ids.includes(bodyB.id)) {
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
    Render.world(this.render);
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

    this.unmarkObject(this.objects[lastIdx]);
    this.markActiveObject(this.objects[this.activeObjectIndex]);
  };

  /**
   * @param {string} id
   */
  markActiveObject = id => {
    const body = this.bodies[id];
    body.render.fillStyle = WALL_FILL_SELECTED;
  };

  /**
   * @param {string} id
   */
  unmarkObject = id => {
    const body = this.bodies[id];
    body.render.fillStyle = WALL_FILL_UNSELECTED;
  };

  /**
   * @param {number} vx
   * @param {number} vy
   */
  setObjectVelocity = (vx, vy) => {
    const id = this.objects[this.activeObjectIndex];
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
      frozenVelocities[id] = body.velocity;

      Body.setVelocity(body, { x: 0, y: 0 });
      Body.setStatic(body, true);
    }

    this.frozenVelocities = frozenVelocities;
  };

  unfreeze = () => {
    if (!this.isFrozen) {
      return;
    }

    this.isFrozen = false;
    for (let id of this.gravityBodies) {
      if (this.frozenVelocities[id]) {
        const body = this.bodies[id];
        Body.setStatic(body, false);
        Body.setVelocity(body, this.frozenVelocities[id]);
      }
    }

    this.frozenVelocities = {};
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
  };
}
