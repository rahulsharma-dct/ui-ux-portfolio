import React, { useState, useEffect, useRef } from 'react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

export const Snake: React.FC = () => {
  const GRID_SIZE = 20;
  const CELL_COUNT = 15; // 15x15 Grid

  const [snake, setSnake] = useState<Position[]>([
    { x: 7, y: 7 },
    { x: 7, y: 8 }
  ]);
  const [food, setFood] = useState<Position>({ x: 3, y: 3 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snake_highscore') || '0', 10);
  });
  const [speed, setSpeed] = useState<number>(150); // Speed in ms

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const nextDirectionRef = useRef<Direction>('UP');

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') nextDirectionRef.current = 'UP';
          e.preventDefault();
          break;
        case 'ArrowDown':
          if (direction !== 'UP') nextDirectionRef.current = 'DOWN';
          e.preventDefault();
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') nextDirectionRef.current = 'LEFT';
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') nextDirectionRef.current = 'RIGHT';
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isPlaying, isGameOver]);

  // Main Game Loop
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameLoopRef.current = setInterval(() => {
        moveSnake();
      }, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, isGameOver, snake, direction, speed]);

  const generateFood = (currentSnake: Position[]): Position => {
    let newFood: Position;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * CELL_COUNT),
        y: Math.floor(Math.random() * CELL_COUNT)
      };
      isOnSnake = currentSnake.some(cell => cell.x === newFood.x && cell.y === newFood.y);
    }
    return newFood!;
  };

  const moveSnake = () => {
    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };
      const currentDir = nextDirectionRef.current;
      setDirection(currentDir);

      switch (currentDir) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check walls collision
      if (head.x < 0 || head.x >= CELL_COUNT || head.y < 0 || head.y >= CELL_COUNT) {
        triggerGameOver();
        return prevSnake;
      }

      // Check body collision
      if (prevSnake.some(cell => cell.x === head.x && cell.y === head.y)) {
        triggerGameOver();
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((prevScore) => {
          const newScore = prevScore + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snake_highscore', newScore.toString());
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail
      }

      return newSnake;
    });
  };

  const triggerGameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);
  };

  const startGame = () => {
    setSnake([
      { x: 7, y: 7 },
      { x: 7, y: 8 }
    ]);
    setFood({ x: 3, y: 3 });
    setDirection('UP');
    nextDirectionRef.current = 'UP';
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] text-xs font-sans text-black select-none">
      
      {/* Game Header Panel */}
      <div className="bg-[#002040] text-white px-3 py-1.5 flex justify-between items-center text-[11px] font-bold">
        <span>XP Snake Arcade</span>
        <div className="flex space-x-4">
          <span>Score: <strong className="text-green-400">{score}</strong></span>
          <span>High Score: <strong className="text-yellow-400">{highScore}</strong></span>
        </div>
      </div>

      <div className="flex-grow p-4 flex flex-col sm:flex-row items-center sm:items-stretch justify-between space-y-4 sm:space-y-0 sm:space-x-4 overflow-auto">
        
        {/* Game Grid Container */}
        <div className="relative flex items-center justify-center p-1 border-2 border-[#808080] bg-black rounded shadow-[inset_2px_2px_3px_rgba(0,0,0,0.5)] flex-grow w-full max-w-[75vw] max-h-[60vh] aspect-square min-w-[240px] min-h-[240px]">
          <div 
            className="grid bg-[#0a200a] gap-[1px] w-full h-full"
            style={{
              gridTemplateColumns: `repeat(${CELL_COUNT}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: CELL_COUNT * CELL_COUNT }).map((_, idx) => {
              const x = idx % CELL_COUNT;
              const y = Math.floor(idx / CELL_COUNT);
              
              const isSnakeCell = snake.some(cell => cell.x === x && cell.y === y);
              const isSnakeHead = snake[0].x === x && snake[0].y === y;
              const isFoodCell = food.x === x && food.y === y;

              return (
                <div
                  key={idx}
                  className={`w-full h-full rounded-[2px] transition-colors duration-75 ${
                    isSnakeHead
                      ? 'bg-[#388e3c] border border-green-300'
                      : isSnakeCell
                        ? 'bg-[#4caf50]'
                        : isFoodCell
                          ? 'bg-[#e53935] animate-pulse'
                          : 'bg-[#152e15]/20'
                  }`}
                ></div>
              );
            })}
          </div>

          {/* Game Over Screen Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/75 flex flex-col justify-center items-center text-white">
              <span className="text-red-500 font-bold text-lg select-none mb-1">GAME OVER</span>
              <span className="text-gray-300 text-[11px] mb-4">Your Score: {score}</span>
              <button
                onClick={startGame}
                className="xp-btn-classic px-5 py-1.5 font-bold rounded text-black cursor-pointer shadow-xs"
              >
                Restart Game
              </button>
            </div>
          )}

          {/* Welcome Screen Overlay */}
          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 bg-[#000]/70 flex flex-col justify-center items-center text-white">
              <span className="text-green-400 font-bold text-[13px] tracking-wide mb-3 select-none">XP SNAKE ARCADE</span>
              <span className="text-[10px] text-gray-400 text-center px-4 mb-4 leading-normal">
                Use Arrow Keys on your keyboard to navigate the snake and eat apples. Don't run into walls or yourself!
              </span>
              <button
                onClick={startGame}
                className="xp-btn-classic px-6 py-1.5 font-bold rounded text-black cursor-pointer shadow-xs"
              >
                Start Game
              </button>
            </div>
          )}
        </div>

        {/* Side Control panel */}
        <div className="w-full sm:w-[130px] bg-[#ECE9D8] border border-[#808080] p-3 rounded flex flex-col justify-between shadow-xs select-none">
          <div className="space-y-3.5">
            <div>
              <label className="block font-bold text-[10.5px] text-gray-600 mb-1">Game Speed:</label>
              <select
                disabled={isPlaying}
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                className="w-full bg-white border border-[#7F9DB9] px-1 py-0.5 outline-none text-[11px] cursor-pointer"
              >
                <option value={200}>🐌 Easy</option>
                <option value={140}>🐍 Normal</option>
                <option value={80}>⚡ Expert</option>
              </select>
            </div>

            <div className="text-[10px] text-gray-500 leading-normal bg-white/50 p-2 border border-dotted border-gray-400 rounded">
              <strong>Tip:</strong> You can change the speed level before launching a new game session.
            </div>
          </div>

          <div className="pt-4 border-t border-[#A0A0A0] mt-4 space-y-2">
            {isPlaying && (
              <button
                onClick={() => setIsPlaying(false)}
                className="xp-btn-classic w-full py-1 font-bold rounded text-black cursor-pointer text-[10.5px]"
              >
                Pause
              </button>
            )}
            {!isPlaying && snake.length > 2 && !isGameOver && (
              <button
                onClick={() => setIsPlaying(true)}
                className="xp-btn-classic w-full py-1 font-bold rounded text-black cursor-pointer text-[10.5px]"
              >
                Resume
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
