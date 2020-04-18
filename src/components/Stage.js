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
        wireframes: false
      }
    });

    const box = Bodies.rectangle(400, 200, 80, 80);
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    World.add(this.engine.world, [box, ground]);
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
