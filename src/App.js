import React from "react";
import Level from "./components/Level";
import { PLAYGROUND } from "./data/levels";

function App() {
  const level = React.useRef(PLAYGROUND);

  return (
    <div className="App">
      <Level data={level.current} />
    </div>
  );
}

export default App;
