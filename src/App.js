import React from "react";
import Level from "./components/Level";
import Debug from "./components/Debug";
import { PLAYGROUND } from "./data/levels";

function App() {
  const level = React.useRef(PLAYGROUND());
  const [, forceUpdate] = React.useState(0);
  return (
    <div className="App">
      <Level
        data={level.current}
        onUpdateData={() => {
          forceUpdate(f => f + 1);
        }}
      />
      <Debug data={level.current} />
    </div>
  );
}

export default App;
