import { Engine, Render, World } from "matter-js";

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

  /** @type Matter.Render */
  render;

  /** @type number */
  lastRenderedTime;

  /**
   *
   * @param {{ [id: string]: (t) => Matter.Body }} bodies
   * @param {{ width: number }} options
   */
  constructor(bodies, options = {}) {
    this.width = options.width || DEFAULT_WIDTH;
    this.initBodies = bodies;

    this.preInit();
  }

  preInit = () => {
    this.engine = Engine.create();
    this.lastRenderedTime = 0;

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
        height: this.width
      }
    });
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
}
