// import { useState } from "react";
import GameBoard from "./GameBoard";

function App() {

  // const [score, setScore] = useState(0);

  return (
    <div className="start-screen">
      <h1> My Snake Game 🐍</h1>

      {/* <button onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? "Resume" : "Pause"}
      </button> */}
      {/* <p>Score: {score}</p> */}

      <GameBoard />

      {/* <button onClick={() => setScore(score + 1)}>
        Add Score
      </button> */}
    </div>
  );
}

export default App;
