import { Bodies } from "matter-js";

const normalBody = func => tform => func(tform);

export const spirit = (x, y, radius = 20) =>
  normalBody(t =>
    Bodies.circle(t(x), t(y), t(radius), {
      restitution: 1,
      render: { fillStyle: "white" }
    })
  );

export const wall = (x, y, width, height, angle = 0) =>
  normalBody(t =>
    Bodies.rectangle(t(x), t(y), t(width), t(height), {
      isStatic: true,
      angle
    })
  );
