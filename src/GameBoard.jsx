import "./GameBoard.css";
import { useState, useEffect, useRef } from "react";


function GameBoard() {
    const cells = Array.from({ length: 400 }, (_, index) => index);
    const directionRef = useRef("right");

    const [snake, setSnake] = useState([210, 209, 208]);
    const [direction, setDirection] = useState("right");
    const [food, setFood] = useState(100);

    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const [difficulty, setDifficulty] = useState("medium");

    const eatSound = useRef(new Audio("/sounds/eat.mp3"));
    const gameOverSound = useRef(new Audio("/sounds/gameover.mp3"));
    const clickSound = useRef(new Audio("/sounds/click.mp3"));
            
    useEffect(() => {
        const savedHighScore = localStorage.getItem("highScore");

        if (savedHighScore !== null) {
            setHighScore(Number(savedHighScore));
        }
    }, []);

    
    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("highScore", score);
        }
    }, [score, highScore]);

    
    const changeDirection = (newDirection) => {
        const currentDirection = directionRef.current;

        if (newDirection === "right" && currentDirection === "left") return;
        if (newDirection === "left" && currentDirection === "right") return;
        if (newDirection === "up" && currentDirection === "down") return;
        if (newDirection === "down" && currentDirection === "up") return;

        directionRef.current = newDirection;
        setDirection(newDirection);
    };


    
const baseSpeed =
    difficulty === "easy" ? 250 :
    difficulty === "medium" ? 180 :
    120;

const speed = Math.max(
    70,
    baseSpeed - Math.floor(score / 5) * 50
);


    const generateFood = (currentSnake) => {
    let newFood;

    do {
        newFood = Math.floor(Math.random() * 400);
    } while (currentSnake.includes(newFood));

    return newFood;
};


const playGameOverSound = () => {
    gameOverSound.current.currentTime = 0;

    gameOverSound.current.play().catch((error) => {
        console.log("Game Over sound error:", error);
    });
};


const playClickSound = () => {
    clickSound.current.currentTime = 0;

    clickSound.current.play().catch((error) => {
        console.log("Click sound error:", error);
    });
};

    // Keyboard controls
    useEffect(() => {
       const handleKeyDown = (event) => {

        if (event.key === "ArrowRight" && directionRef.current !== "left") {
            directionRef.current = "right";
            setDirection("right");
        }
        else if (event.key === "ArrowLeft" && directionRef.current !== "right") {
            directionRef.current = "left";
            setDirection("left");
        }
        else if (event.key === "ArrowUp" && directionRef.current !== "down") {
            directionRef.current = "up";
            setDirection("up");
        }
        else if (event.key === "ArrowDown" && directionRef.current !== "up") {
            directionRef.current = "down";
            setDirection("down");
        }
    };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };

    }, [direction]);


    
    // Automatic movement
    useEffect(() => {
        if (!hasStarted || gameOver || isPaused) {
            return;
        }

        const interval = setInterval(() => {
            const head = snake[0];
            let newHead = head;

            if (direction === "right") {
                if (head % 20 !== 19) {
                    newHead = head + 1;
                } else {
                    playGameOverSound();
                    setGameOver(true);
                    return;
                }
            } else if (direction === "left") {
                if (head % 20 !== 0) {
                    newHead = head - 1;
                } else {
                    playGameOverSound();
                    setGameOver(true);
                    return;
                }
            } else if (direction === "up") {
                if (Math.floor(head / 20) > 0) {
                    newHead = head - 20;
                } else {
                    playGameOverSound();
                    setGameOver(true);
                    return;
                }
            } else if (direction === "down") {
                if (Math.floor(head / 20) < 19) {
                    newHead = head + 20;
                }else {
                    playGameOverSound();
                    setGameOver(true);
                    return;
                }
            }

       
            if (snake.includes(newHead)) {
                playGameOverSound();
                setGameOver(true);
                return;
            }
         


            if (newHead === food) {
                eatSound.current.currentTime = 0;
                eatSound.current.play();

                setFood(generateFood([newHead, ...snake]));
                setScore((currentScore) => currentScore + 1);
                setSnake([newHead, ...snake]);
            } else {
                setSnake([newHead, ...snake.slice(0, -1)]);
            }
        }, speed);

        return () => {
            clearInterval(interval);
        };
    }, [snake, direction, food, gameOver, speed, isPaused, hasStarted]);


    // Restart game
    const restartGame = () => {
            setSnake([210, 209, 208]);
            setDirection("right");
            directionRef.current = "right";
            setFood(100);
            setScore(0);
            setGameOver(false);
            setIsPaused(false);
            setHasStarted(false);
        };
    return (
        <>

          {!hasStarted ? (
            <div className="start-screen">
                {/* <h1>🐍 Snake Game</h1> */}
                <p>Ready for a challenge?</p>
                
                <button onClick={() => {
                    playClickSound();
                    setHasStarted(true);
                }}>
                    Start Game
                </button>

                
                <div className="game-tips">
                    <h2>🐍 How to Play</h2>
                    <p>🎮 Use arrow keys to move.</p>
                    <p>🍎 Eat food to score points.</p>
                    <p>⚠️ Avoid walls and your tail.</p>
                    <p>⏸️ Pause whenever you need.</p>
                    <p>🏆 Beat your high score!</p>
                </div>


            </div>
        ) : (

        <div className="game-container">
            
         <div className="game-header">
        <div className="score-info">
            <h1>Score: {score}</h1>
            <h2>High Score: {highScore}</h2>
        </div>

        <button onClick={() => { playClickSound();
        setIsPaused(!isPaused)}}>
            {isPaused ? "Resume" : "Pause"}
        </button>
        </div>
            {isPaused && (
                <h2 className="paused-message">GAME PAUSED</h2>
            )}

            <div className="game-board">

                {cells.map((cell) => (
                    <div
                        key={cell}
                        className={
                            snake.includes(cell)
                                ? "cell snake"
                                : cell === food
                                    ? "cell food"    
                                    : "cell"
                        }
                    >
                    </div>

                    
                ))}

                {gameOver && (
                <div className="game-over">
                    <h2>GAME OVER</h2>
                    <button onClick={() => {
                        playClickSound();
                        restartGame();
                }}>Restart</button>
                </div>
            )}

            </div>



            
       
<div className="difficulty-buttons">
    <button
        className={difficulty === "easy" ? "active easy" : "easy"}
        onClick={() =>{ playClickSound(); setDifficulty("easy")}}
    >
        Easy
    </button>

    <button
        className={difficulty === "medium" ? "active medium" : "medium"}
        onClick={() =>{ playClickSound(); setDifficulty("medium")}}
    >
        Medium
    </button>

    <button
        className={difficulty === "hard" ? "active hard" : "hard"}
        onClick={() =>{ playClickSound(); setDifficulty("hard")}}
    >
        Hard
    </button>
</div>



            
            
        <div className="mobile-controls">
            <button onClick={() => changeDirection("up")}>
                ↑
            </button>

            <div>
                <button onClick={() => changeDirection("left")}>
                    ←
                </button>

                <button onClick={() => changeDirection("down")}>
                    ↓
                </button>

                <button onClick={() => changeDirection("right")}>
                    →
                </button>
            </div>
        </div>


            

            </div>
        )}
        </>
    );
}

export default GameBoard;