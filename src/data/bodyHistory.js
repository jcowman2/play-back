import { Body, Vector } from "matter-js";

export default class BodyHistory {
  /** @type Matter.Body */
  body;

  /** @type {Array<{ time: number, position: Matter.Vector, delta: Matter.Vector }>} */
  history;

  constructor(body) {
    this.body = body;
    this.history = [];
  }

  log = time => {
    const lastPos = this.history.length
      ? this.history[this.history.length - 1].position
      : this.body.position;

    const delta = Vector.sub(this.body.position, lastPos);
    const { x, y } = this.body.position;

    this.history.push({ time, position: { x, y }, delta });
  };

  clear = () => {
    this.history = [];
  };

  revertTo = destTime => {
    let translate = Vector.create();

    for (let i = this.history.length - 1; i >= 0; i--) {
      const { time, delta } = this.history[i];
      translate = Vector.sub(translate, delta);

      if (time > destTime) {
        continue;
      }

      Body.translate(this.body, translate);
      this.history.splice(i, this.history.length);
      break;
    }
  };
}
