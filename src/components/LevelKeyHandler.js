import React from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { UP, DOWN, LEFT, RIGHT } from "../constants";

const KEYDOWN_KEYS = [
  "space",
  "r",
  "ctrl",
  "w",
  "a",
  "s",
  "d",
  "up",
  "left",
  "down",
  "right"
];

const KEYUP_KEYS = ["w", "a", "s", "d", "up", "left", "down", "right"];

/**
 *
 * @param {React.PropsWithChildren<{
 *  onPlayPause: () => void,
 *  onRestart: () => void,
 *  onToggleSelected: () => void,
 *  onMoveKeyPress: (direction: string) => void,
 *  onMoveKeyRelease: (direction: string) => void
 * }>} props
 */
function LevelKeyHandler(props) {
  const {
    onPlayPause,
    onRestart,
    onToggleSelected,
    onMoveKeyPress,
    onMoveKeyRelease
  } = props;

  return (
    <>
      <KeyboardEventHandler
        handleKeys={KEYDOWN_KEYS}
        onKeyEvent={key => {
          switch (key) {
            case "space":
              return onPlayPause();
            case "r":
              return onRestart();
            case "ctrl":
              return onToggleSelected();
            case "w":
            case "up":
              return onMoveKeyPress(UP);
            case "s":
            case "down":
              return onMoveKeyPress(DOWN);
            case "a":
            case "left":
              return onMoveKeyPress(LEFT);
            case "d":
            case "right":
              return onMoveKeyPress(RIGHT);
            default:
              return;
          }
        }}
      />
      <KeyboardEventHandler
        handleEventType="keyup"
        handleKeys={KEYUP_KEYS}
        onKeyEvent={key => {
          switch (key) {
            case "w":
            case "up":
              return onMoveKeyRelease(UP);
            case "s":
            case "down":
              return onMoveKeyRelease(DOWN);
            case "a":
            case "left":
              return onMoveKeyRelease(LEFT);
            case "d":
            case "right":
              return onMoveKeyRelease(RIGHT);
            default:
              return;
          }
        }}
      />
    </>
  );
}

export default LevelKeyHandler;
