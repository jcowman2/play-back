import { UP, DOWN, LEFT, RIGHT, CW, CCW } from "../../constants";

export default class SelectableMovement {
  speed;
  angularSpeed;

  constructor(speed, angularSpeed) {
    this.speed = speed;
    this.angularSpeed = angularSpeed;

    for (let dir of [UP, DOWN, LEFT, RIGHT, CW, CCW]) {
      this[dir] = false;
    }
  }

  startMove = direction => {
    this[direction] = true;
  };

  stopMove = direction => {
    this[direction] = false;
  };

  getVelocity = () => {
    const x =
      (((this[LEFT] ? -1 : 0) + (this[RIGHT] ? 1 : 0)) * this.speed) / 1000;
    const y =
      (((this[UP] ? -1 : 0) + (this[DOWN] ? 1 : 0)) * this.speed) / 1000;
    return { x, y };
  };

  getAngularVelocity = () => {
    return (
      (((this[CCW] ? -1 : 0) + (this[CW] ? 1 : 0)) * this.angularSpeed) / 1000
    );
  };

  isMoving = () => {
    const { x, y } = this.getVelocity();
    return x || y || this.getAngularVelocity();
  };
}
