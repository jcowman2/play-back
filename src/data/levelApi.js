import BodiesManager from "./bodiesManager";
import LoopManager from "./loopManager";
import { GAME_EVENT } from "../constants";

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

  /** @type boolean */
  reversed;

  /** @type {Array<{type: string, data}>} */
  events;

  /** @type React.ReactInstance */
  ref;

  /** @type boolean */
  blockingEvent;

  /** @type () => void */
  onEnterGoal;

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
    this.onEnterGoal = onEnterGoal;
    this.initialized = true;
  };

  start = () => {
    this.bodies = new BodiesManager(this, this.bodiesInitializer);
    this.loop = new LoopManager(this, this.bodies.all);

    this.bodies.start();
    this.loop.start(this.ref);
    this.bodies.attachEventListeners();

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
        return this.frozen ? this.unfreeze() : this.freeze();
      case GAME_EVENT.RESTART:
        return this.restart();
      case GAME_EVENT.SELECT:
        return this.bodies.selectNext();
      case GAME_EVENT.MOVE:
      case GAME_EVENT.ROTATE:
        return this.bodies.moveSelected(data);
      case GAME_EVENT.MOVE_END:
      case GAME_EVENT.ROTATE_END:
        return this.bodies.stopMovingSelected(data);
      case GAME_EVENT.REVERSE:
        return this.reverse();
      case GAME_EVENT.FORWARD:
        return this.forward();
      default:
        console.log("not handled", type);
    }
  };

  teardown = () => {
    this.loop.teardown();
  };

  restart = () => {
    this.teardown();
    this.start();
  };

  getPlayTime = () => {
    return this.loop.playTime;
  };

  freeze = () => {
    this.frozen = true;
    this.bodies.freeze();
  };

  unfreeze = () => {
    this.frozen = false;
    this.bodies.unfreeze();
  };

  reverse = () => {
    this.freeze();
    this.reversed = true;
  };

  forward = () => {
    this.reversed = false;
  };
}
