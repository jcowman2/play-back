import React from "react";

function Debug(props) {
  const { data } = props;
  if (!data) {
    return;
  }

  return (
    <div style={{ color: "white" }}>
      {(() => {
        const {
          playTime,
          isFrozen,
          isReverse,
          bodies,
          frozenVelocities
        } = data;
        const { isStatic, velocity } = bodies.spirit;
        const { x, y } = velocity;

        const { x: fx, y: fy } = frozenVelocities.spirit || {};

        return (
          <>
            <p>
              Play Time: {playTime}, Frozen: {String(isFrozen)}, Reverse:{" "}
              {String(isReverse)}
            </p>
            <p>
              Static: {String(isStatic)}, Velocity: ({x.toFixed(3)},{" "}
              {y.toFixed(3)}), Frozen Velocity: ({fx && fx.toFixed(3)},{" "}
              {fy && fy.toFixed(3)})
            </p>
          </>
        );
      })()}
    </div>
  );
}

export default Debug;
