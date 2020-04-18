import { Engine, Render, Bodies, World } from "matter-js";

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

export class LevelData {
  /** @type number */
  width;

  /** @type number */
  height;

  /** @type Matter.Engine */
  engine;

  /** @type {{ [id: string]: Matter.Body }} */
  bodies;

  /** @type Matter.Render */
  render;

  /** @type number */
  lastRenderedTime = 0;

  /**
   *
   * @param {{ [id: string]: Matter.Body }} bodies
   * @param {{ width: number, height: number }} options
   */
  constructor(bodies, options = {}) {
    this.width = options.width || DEFAULT_WIDTH;
    this.height = options.height || DEFAULT_HEIGHT;

    this.engine = Engine.create();
    this.bodies = bodies;
    World.add(this.engine.world, Object.values(bodies));
  }

  /**
   * @param {React.ReactInstance} ref
   */
  init = ref => {
    if (this.render) {
      return;
    }
    console.log("initting");

    this.render = Render.create({
      element: ref,
      engine: this.engine,
      options: {
        wireframes: false,
        width: this.width,
        height: this.height,
        hasBounds: true
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
}
