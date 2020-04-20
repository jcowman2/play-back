import React from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { DEBUG } from "../constants";

function AdminKeyHandler(props) {
  const { onSetLevel, onAnyKey } = props;

  return (
    <>
      <KeyboardEventHandler
        handleKeys={["numeric"]}
        onKeyEvent={key => {
          if (DEBUG) {
            onSetLevel(Number(key));
          }
        }}
      />
      <KeyboardEventHandler handleKeys={["all"]} onKeyEvent={onAnyKey} />
    </>
  );
}

export default AdminKeyHandler;
