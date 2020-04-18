import { Engine, Render, World } from "matter-js";
import { DARK, LIGHT, MID_LIGHT } from "../constants";

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

  /**
   *
   * @param {{ [id: string]: (t) => Matter.Body }} bodies
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
    this.engine = Engine.create();
    this.lastRenderedTime = 0;
    this.activeObjectIndex = 0;

    const bodiesMap = {};
    const allBodies = [];
    for (let bodyId in this.initBodies) {
      const body = this.normalize(this.initBodies[bodyId]);
      bodiesMap[bodyId] = body;
      allBodies.push(body);
    }

    this.bodies = bodiesMap;
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
    this.lastRenderedTime = newTime;
    const delta = newTime - this.lastRenderedTime;

    Engine.update(this.engine, delta);
    Render.world(this.render);
  };

  /**
   * @param {(t) => Matter.Body} bodyCtor
   */
  normalize = bodyCtor => bodyCtor(unit => (unit / 100) * this.width);

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
}
