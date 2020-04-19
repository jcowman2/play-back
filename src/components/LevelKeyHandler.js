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
  "right",
  "q",
  "e",
  "shift"
];

const KEYUP_KEYS = [
  "w",
  "a",
  "s",
  "d",
  "up",
  "left",
  "down",
  "right",
  "q",
  "e",
  "shift"
];

/**
 *
 * @param {React.PropsWithChildren<{
 *  onFreezeUnfreeze: () => void,
 *  onRestart: () => void,
 *  onToggleSelected: () => void,
 *  onMoveKeyPress: (direction: string) => void,
 *  onMoveKeyRelease: (direction: string) => void,
 *  onRotateKeyPress: (clockwise: boolean) => void,
 *  onRotateKeyRelease: (clockwise: boolean) => void
 *  onReverseKeyPress: () => void,
 *  onReverseKeyRelease: () => void
 * }>} props
 */
function LevelKeyHandler(props) {
  const {
    onFreezeUnfreeze,
    onRestart,
    onToggleSelected,
    onMoveKeyPress,
    onMoveKeyRelease,
    onRotateKeyPress,
    onRotateKeyRelease,
    onReverseKeyPress,
    onReverseKeyRelease
  } = props;

  return (
    <>
      <KeyboardEventHandler
        handleKeys={KEYDOWN_KEYS}
        onKeyEvent={key => {
          switch (key) {
            case "space":
              return onFreezeUnfreeze();
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
            case "q":
              return onRotateKeyPress(false);
            case "e":
              return onRotateKeyPress(true);
            case "shift":
              return onReverseKeyPress();
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
            case "q":
              return onRotateKeyRelease(false);
            case "e":
              return onRotateKeyRelease(true);
            case "shift":
              return onReverseKeyRelease();
            default:
              return;
          }
        }}
      />
    </>
  );
}

export default LevelKeyHandler;
