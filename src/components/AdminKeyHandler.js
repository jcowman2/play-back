import React from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";

function AdminKeyHandler(props) {
  const { onSetLevel } = props;

  return (
    <KeyboardEventHandler
      handleKeys={["numeric"]}
      onKeyEvent={key => onSetLevel(Number(key))}
    />
  );
}

export default AdminKeyHandler;
