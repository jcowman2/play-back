import React from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";

/**
 *
 * @param {React.PropsWithChildren<{
 *  onPlayPause: () => void
 * }>} props
 */
function LevelKeyHandler(props) {
  const { onPlayPause } = props;

  return (
    <>
      <KeyboardEventHandler handleKeys={["space"]} onKeyEvent={onPlayPause} />
    </>
  );
}

export default LevelKeyHandler;
