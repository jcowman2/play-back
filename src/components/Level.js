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

  const [time, setTime] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [loop, setLoop] = React.useState();

  const handlePlayPause = () => {
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
  };

  return (
    <>
      <Stage levelData={data} time={time} />
      <LevelKeyHandler onPlayPause={handlePlayPause} />
    </>
  );
}

export default Level;
