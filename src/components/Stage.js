import React from "react";
import { Engine, Render, Bodies, World } from "matter-js";

/**
 * Props:
 * - time
 */
/*
function Stage(props) {
  const { time } = props;

  const stage = React.createRef();
  const engine = React.createRef(() => Engine.create());
  const render = React.createRef(() =>
    Render.create({ element: stage, engine })
  );

  const [lastRenderedTime, setLastRenderedTime] = React.useState(0);

  React.useEffect(() => {
    if (!engine.current) {
      return;
    }
    const box = Bodies.rectangle(400, 200, 80, 80);
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    World.add(engine.current.world, [box, ground]);
  }, [engine]);

  React.useEffect(() => {
    if (time > lastRenderedTime) {
      const delta = time - lastRenderedTime;
      setLastRenderedTime(delta);
      console.log("update", delta);
      Engine.update(engine.current, delta);
    }
  }, [time, lastRenderedTime, engine]);

  React.useEffect(() => {
    if (render.current) {
      Render.world(render.current);
    }
  }, [render]);

  return <div ref={stage} />;
}

export default Stage;
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
      console.log("update", delta);
      Engine.update(this.engine, delta);
      Render.world(this.gameRender);
      this.setState({ lastRenderedTime: this.props.time });
    }
  }

  render() {
    return <div ref="stage" />;
  }
}
