import React from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";

/**
 *
 * @param {React.PropsWithChildren<{
 *  onPlayPause: () => void,
 *  onRestart: () => void
 * }>} props
 */
function LevelKeyHandler(props) {
  const { onPlayPause, onRestart } = props;

  return (
    <>
      <KeyboardEventHandler handleKeys={["space"]} onKeyEvent={onPlayPause} />
      <KeyboardEventHandler handleKeys={["r"]} onKeyEvent={onRestart} />
    </>
  );
}

export default LevelKeyHandler;
