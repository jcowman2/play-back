import { Engine, World, Render } from "matter-js";
import { GAME_BG, LEVEL_WIDTH, LOOP_INTERVAL } from "../../constants";

export default class LoopManager {
  /** @type LevelApi */
  level;

  /** @type Matter.Engine */
  engine;

  /** @type Matter.Render */
  render;

  /** @type number */
  globalTime;

  /** @type number */
  playTime;

  /** @type number */
  intervalRef;

  constructor(level, allBodies) {
    this.level = level;
    this.globalTime = 0;
    this.engine = Engine.create();
    this.engine.world.gravity.scale = 0;
    World.add(this.engine.world, allBodies);
  }

  /**
   * @param {React.ReactInstance} ref
   * @param {() => void} onEnterGoal
   * @param {(data: LevelData) => void} onUpdateData
   */
  start = (ref, onEnterGoal, onUpdateData) => {
    this.render = Render.create({
      element: ref,
      engine: this.engine,
      options: {
        wireframes: false,
        width: LEVEL_WIDTH,
        height: LEVEL_WIDTH,
        background: GAME_BG
      }
    });

    Render.world(this.render);
    this.intervalRef = setInterval(this.update, LOOP_INTERVAL);
    this.playTime = 0;
  };

  update = () => {
    this.globalTime += LOOP_INTERVAL;

    if (this.level.reversed) {
      this.playTime = Math.max(0, this.playTime - LOOP_INTERVAL);
    } else if (!this.level.frozen) {
      this.playTime += LOOP_INTERVAL;
    }

    if (this.level.blockingEvent) {
      return;
    }

    this.level.update();

    Engine.update(this.engine, LOOP_INTERVAL);
    Render.world(this.render);
  };

  teardown = () => {
    this.intervalRef = clearInterval(this.intervalRef);

    Render.stop(this.render);
    World.clear(this.engine.world);
    Engine.clear(this.engine);

    this.render.canvas.remove();
    setTimeout(() => {
      this.render.canvas = null;
      this.render.context = null;
      this.render.textures = {};
    }, LOOP_INTERVAL);
  };
}
