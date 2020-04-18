import { Engine, Render, World, Body } from "matter-js";
import { DARK, LIGHT, MID_LIGHT, GRAVITY_X, GRAVITY_Y } from "../constants";

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

  /**
   *
   * @param {{ [id: string]: (t) => { body: Matter.Body, gravity: boolean }}} bodies
   * @param {string[]} objects
   * @param {{ width: number }} options
   */
  constructor(bodies, objects, options = {}) {
    this.width = options.width || DEFAULT_WIDTH;
    this.objects = objects;
    this.initBodies = bodies;

    this.preInit();
  }

  preInit = () => {
    this.lastRenderedTime = 0;
    this.activeObjectIndex = 0;

    this.engine = Engine.create();
    this.engine.world.gravity.scale = 0;

    const bodiesMap = {};
    const allBodies = [];
    const gravityBodies = [];
    for (let bodyId in this.initBodies) {
      const { body, gravity } = this.initBodies[bodyId](this.normalize);

      if (gravity) {
        gravityBodies.push(bodyId);
      }

      bodiesMap[bodyId] = body;
      allBodies.push(body);
    }

    this.bodies = bodiesMap;
    this.gravityBodies = gravityBodies;
    World.add(this.engine.world, allBodies);
  };

  /**
   * @param {React.ReactInstance} ref
   */
  init = ref => {
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
        background: DARK
      }
    });

    this.markActiveObject(this.objects[this.activeObjectIndex]);

    Render.world(this.render);
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

    this.updateGravity(delta);

    Engine.update(this.engine, delta);
    Render.world(this.render);
  };

  updateGravity = delta => {
    for (let key of this.gravityBodies) {
      const body = this.bodies[key];
      const force = {
        x: body.mass * ((GRAVITY_X * delta) / 1000),
        y: body.mass * ((GRAVITY_Y * delta) / 1000)
      };
      Body.applyForce(body, body.position, force);
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
    body.render.fillStyle = LIGHT;
  };

  /**
   * @param {string} id
   */
  unmarkObject = id => {
    const body = this.bodies[id];
    body.render.fillStyle = MID_LIGHT;
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
}
