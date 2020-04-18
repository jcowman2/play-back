import React from "react";
import Stage from "./Stage";
import LevelKeyHandler from "./LevelKeyHandler";

const LOOP_INTERVAL = 10;

/**
 *
 * @param {React.PropsWithChildren<{
 *  data: LevelData,
 * }>} props
 */
function Level(props) {
  const { data } = props;

  const stageRef = React.useRef();
  const [time, setTime] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [loop, setLoop] = React.useState();

  const handlePause = () => {
    clearInterval(loop);
    setLoop(null);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      return handlePause();
    }
    setLoop(setInterval(() => setTime(t => t + LOOP_INTERVAL), LOOP_INTERVAL));
    setIsPlaying(true);
  };

  const handleRestart = () => {
    if (isPlaying) {
      handlePause();
    }
    stageRef.current.restart();
  };

  const handleToggleSelected = () => {
    stageRef.current.nextObject();
  };

  return (
    <>
      <Stage ref={stageRef} levelData={data} time={time} />
      <LevelKeyHandler
        onPlayPause={handlePlayPause}
        onRestart={handleRestart}
        onToggleSelected={handleToggleSelected}
      />
    </>
  );
}

export default Level;
