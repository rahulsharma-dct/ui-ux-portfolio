import React, { useState, useEffect, useRef } from 'react';

const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

const COLORS: Record<string, string> = {
  I: 'bg-[#00ffff] border-[#00cccc]',
  O: 'bg-[#ffff00] border-[#cccc00]',
  T: 'bg-[#800080] border-[#660066]',
  S: 'bg-[#00ff00] border-[#00cc00]',
  Z: 'bg-[#ff0000] border-[#cc0000]',
  J: 'bg-[#0000ff] border-[#0000cc]',
  L: 'bg-[#ffa500] border-[#cc8400]',
};

const ROWS = 20;
const COLS = 10;

export const Tetris: React.FC = () => {
  const [grid, setGrid] = useState<(string | null)[][]>(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [currentPiece, setCurrentPiece] = useState({
    shape: SHAPES.T,
    type: 'T',
    x: 3,
    y: 0,
  });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('tetris_highscore') || '0', 10);
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const gameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize and Reset Game
  const resetGame = () => {
    setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    spawnPiece();
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  const spawnPiece = () => {
    const keys = Object.keys(SHAPES) as (keyof typeof SHAPES)[];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const shape = SHAPES[randomKey];
    setCurrentPiece({
      shape,
      type: randomKey,
      x: Math.floor((COLS - shape[0].length) / 2),
      y: 0,
    });
  };

  // Move Current Piece
  const moveLeft = () => move(-1, 0);
  const moveRight = () => move(1, 0);
  const moveDown = () => {
    if (!move(0, 1)) {
      lockPiece();
    }
  };

  const rotate = () => {
    const nextShape = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map((row) => row[i]).reverse()
    );
    if (validMove(nextShape, currentPiece.x, currentPiece.y)) {
      setCurrentPiece((prev) => ({ ...prev, shape: nextShape }));
    }
  };

  const move = (dx: number, dy: number, pieceShape = currentPiece.shape) => {
    if (validMove(pieceShape, currentPiece.x + dx, currentPiece.y + dy)) {
      setCurrentPiece((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      return true;
    }
    return false;
  };

  const validMove = (shape: number[][], x: number, y: number) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const nextX = x + c;
          const nextY = y + r;
          if (nextX < 0 || nextX >= COLS || nextY >= ROWS) return false;
          if (nextY >= 0 && grid[nextY][nextX]) return false;
        }
      }
    }
    return true;
  };

  const lockPiece = () => {
    setGrid((prevGrid) => {
      const nextGrid = prevGrid.map((row) => [...row]);
      for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
          if (currentPiece.shape[r][c]) {
            const blockY = currentPiece.y + r;
            const blockX = currentPiece.x + c;
            if (blockY >= 0) {
              nextGrid[blockY][blockX] = currentPiece.type;
            }
          }
        }
      }

      // Check row clears
      let rowsCleared = 0;
      const clearedGrid = nextGrid.filter((row) => {
        const isFull = row.every((cell) => cell !== null);
        if (isFull) rowsCleared++;
        return !isFull;
      });

      while (clearedGrid.length < ROWS) {
        clearedGrid.unshift(Array(COLS).fill(null));
      }

      if (rowsCleared > 0) {
        setScore((prevScore) => {
          const points = [0, 40, 100, 300, 1200];
          const newScore = prevScore + points[rowsCleared];
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('tetris_highscore', newScore.toString());
          }
          return newScore;
        });
      }

      return clearedGrid;
    });

    // Spawn new piece or trigger game over
    const keys = Object.keys(SHAPES) as (keyof typeof SHAPES)[];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const shape = SHAPES[randomKey];
    const nextX = Math.floor((COLS - shape[0].length) / 2);
    
    if (!validMove(shape, nextX, 0)) {
      setIsGameOver(true);
      setIsPlaying(false);
    } else {
      spawnPiece();
    }
  };

  // Keyboard Controller
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      switch (e.key) {
        case 'ArrowLeft': moveLeft(); e.preventDefault(); break;
        case 'ArrowRight': moveRight(); e.preventDefault(); break;
        case 'ArrowDown': moveDown(); e.preventDefault(); break;
        case 'ArrowUp': rotate(); e.preventDefault(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver, currentPiece, grid]);

  // Main Tick Interval
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameIntervalRef.current = setInterval(() => {
        moveDown();
      }, 700 - Math.min(score / 5, 500)); // speed up slowly as score increases
    } else {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    }
    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [isPlaying, isGameOver, currentPiece, score]);

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] text-xs font-sans text-black select-none">
      
      {/* Header bar */}
      <div className="bg-[#002040] text-white px-3 py-1.5 flex justify-between items-center text-[11px] font-bold">
        <span>Block Cascade (Tetris)</span>
        <div className="flex space-x-3.5">
          <span>Score: <strong className="text-green-400 font-mono">{score}</strong></span>
          <span>High: <strong className="text-yellow-400 font-mono">{highScore}</strong></span>
        </div>
      </div>

      <div className="flex-grow p-4 flex flex-row items-center justify-between space-x-4 overflow-auto h-full">
        {/* Game Canvas Board Grid */}
        <div className="relative border-2 border-[#808080] bg-[#111111] p-0.5 rounded shadow-[inset_2px_2px_3px_rgba(0,0,0,0.5)] flex-grow w-full max-w-[40vw] max-h-[65vh] aspect-[1/2] min-w-[140px] min-h-[280px]">
          <div 
            className="grid gap-[1px] w-full h-full"
            style={{
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            }}
          >
            {grid.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                // Determine if this cell contains part of the active moving piece
                let isActiveCell = false;
                let activeType = '';
                const piece = currentPiece;
                if (
                  rIdx >= piece.y &&
                  rIdx < piece.y + piece.shape.length &&
                  cIdx >= piece.x &&
                  cIdx < piece.x + piece.shape[0].length
                ) {
                  const relativeRow = rIdx - piece.y;
                  const relativeCol = cIdx - piece.x;
                  if (piece.shape[relativeRow][relativeCol]) {
                    isActiveCell = true;
                    activeType = piece.type;
                  }
                }

                const displayColor = isActiveCell 
                  ? COLORS[activeType] 
                  : cell 
                    ? COLORS[cell] 
                    : 'bg-[#151515]';

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`w-full h-full border-[0.5px] rounded-[1px] ${displayColor}`}
                  ></div>
                );
              })
            )}
          </div>

          {/* Game Over Screen */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center text-white">
              <span className="text-red-500 font-bold text-[13px] tracking-wide mb-1">GAME OVER</span>
              <span className="text-gray-300 text-[10px] mb-3">Score: {score}</span>
              <button
                onClick={resetGame}
                className="xp-btn-classic px-4 py-1 font-bold text-black cursor-pointer shadow-xs"
              >
                Restart
              </button>
            </div>
          )}

          {/* Welcome Screen */}
          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center text-white text-center p-2">
              <span className="text-green-400 font-bold text-[12px] mb-2 select-none">XP BLOCK CASCADE</span>
              <p className="text-[9.5px] text-gray-400 leading-tight mb-4">
                Use Arrow Keys:<br />
                Left / Right: Move<br />
                Up: Rotate<br />
                Down: Soft Drop
              </p>
              <button
                onClick={resetGame}
                className="xp-btn-classic px-5 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Start Game
              </button>
            </div>
          )}
        </div>

        {/* Side Panel Info controls */}
        <div className="w-[100px] flex flex-col justify-between self-stretch bg-[#ECE9D8] border border-[#808080] p-2.5 rounded shadow-xs select-none">
          <div className="space-y-3">
            <div>
              <div className="text-[10px] text-gray-500 font-bold">LEVEL:</div>
              <div className="font-mono text-base font-black text-blue-800">
                {Math.floor(score / 100) + 1}
              </div>
            </div>

            <div className="text-[9.5px] text-gray-600 leading-tight bg-white p-2 border border-gray-400 rounded">
              Clear complete horizontal lines to score points!
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#A0A0A0]">
            {isPlaying && (
              <button
                onClick={() => setIsPlaying(false)}
                className="xp-btn-classic w-full py-1 font-bold rounded text-black cursor-pointer text-[10px]"
              >
                Pause
              </button>
            )}
            {!isPlaying && score > 0 && !isGameOver && (
              <button
                onClick={() => setIsPlaying(true)}
                className="xp-btn-classic w-full py-1 font-bold rounded text-black cursor-pointer text-[10px]"
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
