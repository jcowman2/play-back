import React from "react";
import { Engine, Render, Bodies, World } from "matter-js";

/**
 * Props:
 * - time
 */
export default class Stage extends React.Component {
  state = {
    lastRenderedTime: 0
  };

  componentDidMount() {
    this.engine = Engine.create();
    this.gameRender = Render.create({
      element: this.refs.stage,
      engine: this.engine,
      options: {
        wireframes: false,
        width: 800,
        height: 700
      }
    });

    const box = Bodies.circle(200, 200, 20, {
      restitution: 1.5,
      render: { fillStyle: "white" }
    });
    const ground = Bodies.rectangle(300, 500, 810, 60, {
      isStatic: true,
      angle: 0.5
    });

    World.add(this.engine.world, [box, ground]);
    Render.world(this.gameRender);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.time !== this.props.time &&
      this.props.time > this.state.lastRenderedTime
    ) {
      const delta = this.props.time - this.state.lastRenderedTime;
      Engine.update(this.engine, delta);
      Render.world(this.gameRender);
      this.setState({ lastRenderedTime: this.props.time });
    }
  }

  render() {
    return <div ref="stage" />;
  }
}
