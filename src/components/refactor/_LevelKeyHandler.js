import React from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { UP, DOWN, LEFT, RIGHT, CCW, CW, GAME_EVENT } from "../../constants";

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
 *  onGameEvent
 * }>} props
 */
function LevelKeyHandler(props) {
  const { onGameEvent } = props;

  const gameEvent = (type, data) => onGameEvent({ type, data });

  return (
    <>
      <KeyboardEventHandler
        handleKeys={KEYDOWN_KEYS}
        onKeyEvent={key => {
          switch (key) {
            case "space":
              return gameEvent(GAME_EVENT.FREEZE);
            case "r":
              return gameEvent(GAME_EVENT.RESTART);
            case "ctrl":
              return gameEvent(GAME_EVENT.SELECT);
            case "w":
            case "up":
              return gameEvent(GAME_EVENT.MOVE, UP);
            case "s":
            case "down":
              return gameEvent(GAME_EVENT.MOVE, DOWN);
            case "a":
            case "left":
              return gameEvent(GAME_EVENT.MOVE, LEFT);
            case "d":
            case "right":
              return gameEvent(GAME_EVENT.MOVE, RIGHT);
            case "q":
              return gameEvent(GAME_EVENT.ROTATE, CCW);
            case "e":
              return gameEvent(GAME_EVENT.ROTATE, CW);
            case "shift":
              return gameEvent(GAME_EVENT.REVERSE);
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
              return gameEvent(GAME_EVENT.MOVE_END, UP);
            case "s":
            case "down":
              return gameEvent(GAME_EVENT.MOVE_END, DOWN);
            case "a":
            case "left":
              return gameEvent(GAME_EVENT.MOVE_END, LEFT);
            case "d":
            case "right":
              return gameEvent(GAME_EVENT.MOVE_END, RIGHT);
            case "q":
              return gameEvent(GAME_EVENT.ROTATE_END, CCW);
            case "e":
              return gameEvent(GAME_EVENT.ROTATE_END, CW);
            case "shift":
              return gameEvent(GAME_EVENT.FORWARD);
            default:
              return;
          }
        }}
      />
    </>
  );
}

export default LevelKeyHandler;
