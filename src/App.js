import React from "react";
import Stage from "./components/Stage";

function App() {
  const [time, setTime] = React.useState(0);

  return (
    <div>
      <Stage time={time} />
      <button onClick={() => setTime(t => t + 50)}>Time: {time}</button>
    </div>
  );
}

export default App;
