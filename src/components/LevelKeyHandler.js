import React from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";

/**
 *
 * @param {React.PropsWithChildren<{
 *  onPlayPause: () => void,
 *  onRestart: () => void,
 *  onToggleSelected: () => void
 * }>} props
 */
function LevelKeyHandler(props) {
  const { onPlayPause, onRestart, onToggleSelected } = props;

  return (
    <>
      <KeyboardEventHandler
        handleKeys={["space", "r", "ctrl"]}
        onKeyEvent={key => {
          switch (key) {
            case "space":
              return onPlayPause();
            case "r":
              return onRestart();
            case "ctrl":
              return onToggleSelected();
            default:
              return;
          }
        }}
      />
    </>
  );
}

export default LevelKeyHandler;
