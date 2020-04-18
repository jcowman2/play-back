import React from "react";
import Stage from "./components/Stage";

const LOOP_INTERVAL = 10;

function App() {
  const [time, setTime] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [loop, setLoop] = React.useState();

  return (
    <div>
      <Stage time={time} />
      <button
        onClick={() => {
          if (isPlaying) {
            clearInterval(loop);
            setLoop(null);
            setIsPlaying(false);
          } else {
            setLoop(
              setInterval(() => setTime(t => t + LOOP_INTERVAL), LOOP_INTERVAL)
            );
            setIsPlaying(true);
          }
        }}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}

export default App;
