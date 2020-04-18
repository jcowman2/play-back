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
    // Engine.run(this.engine);
    // Engine.run(this.engine);
    // Render.world(this.gameRender);
    // Engine.update(this.engine, 0);
    // Engine.run(this.engine);
    // Render.run(this.render);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.time !== this.props.time &&
      this.props.time > this.state.lastRenderedTime
    ) {
      const delta = this.props.time - this.state.lastRenderedTime;
      console.log("update", delta);
      Engine.update(this.engine, delta);
      Render.world(this.gameRender);
      this.setState({ lastRenderedTime: this.props.time });
    }
  }

  render() {
    // if (!this.render.world) {
    //   return null;
    // }

    // if (this.state.lastRenderedTime < this.props.time) {
    //   Engine.update(this.engine, this.props.time - this.state.lastRenderedTime);
    //   this.setState({ lastRenderedTime: this.props.time });
    // }

    // if (this.gameRender) {
    //   Render.world(this.gameRender);
    // }

    // Render.world(this.engine);
    return <div ref="stage" />;
  }
}
