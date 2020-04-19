import Events from "matter-js";
import BodiesManager from "./_bodiesManager";
import LoopManager from "./_loopManager";
import { GAME_EVENT } from "../../constants";

export default class LevelApi {
  /** @type {{ [id: string]: (t) => { body: Matter.Body, meta } }} */
  bodiesInitializer;

  /** @type string[] */
  objectSelectOrder;

  /** @type BodiesManager */
  bodies;

  /** @type LoopManager */
  loop;

  /** @type boolean */
  initialized;

  /** @type boolean */
  started;

  /** @type boolean */
  frozen;

  /** @type {Array<{type: string, data}>} */
  events;

  /** @type React.ReactInstance */
  ref;

  /** @type boolean */
  blockingEvent;

  constructor(bodiesInitializer, objectSelectOrder) {
    this.bodiesInitializer = bodiesInitializer;
    this.objectSelectOrder = objectSelectOrder;
    this.initialized = false;
  }

  /**
   * @param {React.ReactInstance} ref
   * @param {() => void} onEnterGoal
   * @param {(data: LevelData) => void} onUpdateData
   */
  init = (ref, onEnterGoal, onUpdate) => {
    this.ref = ref;
    this.initialized = true;
  };

  start = () => {
    this.bodies = new BodiesManager(this, this.bodiesInitializer);
    this.loop = new LoopManager(this, this.bodies.all);

    this.bodies.start();
    this.loop.start(this.ref);

    this.started = true;
    this.frozen = true;
    this.events = [];
    this.blockingEvent = false;
  };

  update = () => {
    if (this.events.length) {
      this.blockingEvent = true;
      const event = this.events.shift();
      this.executeEvent(event);
      this.blockingEvent = false;
    }

    this.bodies.update();
  };

  /**
   * @param {{type: string, data}}
   */
  handleGameKeyEvent = e => {
    this.events.push(e);
  };

  executeEvent = ({ type, data }) => {
    switch (type) {
      case GAME_EVENT.FREEZE:
        this.frozen ? this.bodies.unfreeze() : this.bodies.freeze();
        this.frozen = !this.frozen;
        return;
      case GAME_EVENT.RESTART:
        return this.restart();
      default:
        console.log("not handled", type);
    }
  };

  restart = () => {
    this.loop.teardown();
    this.start();
  };
}
