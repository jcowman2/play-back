import { Body, Vector } from "matter-js";

export default class BodyHistory {
  /** @type Matter.Body */
  body;

  /** @type {Array<{ time: number, position: Matter.Vector }>} */
  history;

  constructor(body) {
    this.body = body;
    this.history = [];
  }

  log = time => {
    const { x, y } = this.body.position;
    this.history.push({ time, position: { x, y } });
  };

  clear = () => {
    this.history = [];
  };

  revertTo = destTime => {
    for (let i = this.history.length - 1; i >= 0; i--) {
      const { time, position } = this.history[i];

      if (time > destTime) {
        continue;
      }

      // const vec = Vector.sub(position, this.body.position);
      Body.setPosition(this.body, position);
      this.history.splice(i, this.history.length);
      break;
    }
  };
}
