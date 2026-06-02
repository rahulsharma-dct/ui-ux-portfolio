import React, { useState, useEffect } from 'react';

type Position = { r: number; c: number };

// 0 = empty dot, 1 = wall, 2 = empty (no dot)
const MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const Pacman: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(() => MAZE.map(row => [...row]));
  const [pacman, setPacman] = useState<Position>({ r: 1, c: 1 });
  const [ghost, setGhost] = useState<Position>({ r: 7, c: 9 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('pacman_highscore') || '0', 10);
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  // Setup game
  const resetGame = () => {
    setGrid(MAZE.map(row => [...row]));
    setPacman({ r: 1, c: 1 });
    setGhost({ r: 7, c: 9 });
    setScore(0);
    setIsGameOver(false);
    setIsGameWon(false);
    setIsPlaying(true);
  };

  // Move Pacman
  const movePacman = (dr: number, dc: number) => {
    if (!isPlaying || isGameOver || isGameWon) return;

    const nextR = pacman.r + dr;
    const nextC = pacman.c + dc;

    // Check Wall collision
    if (grid[nextR]?.[nextC] === 1) return;

    setPacman({ r: nextR, c: nextC });

    // Collect dot
    if (grid[nextR][nextC] === 0) {
      setGrid(prev => {
        const nextGrid = prev.map(row => [...row]);
        nextGrid[nextR][nextC] = 2; // set to empty
        return nextGrid;
      });

      setScore(prev => {
        const newScore = prev + 10;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('pacman_highscore', newScore.toString());
        }
        return newScore;
      });
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver || isGameWon) return;

      switch (e.key) {
        case 'ArrowUp': movePacman(-1, 0); e.preventDefault(); break;
        case 'ArrowDown': movePacman(1, 0); e.preventDefault(); break;
        case 'ArrowLeft': movePacman(0, -1); e.preventDefault(); break;
        case 'ArrowRight': movePacman(0, 1); e.preventDefault(); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver, isGameWon, pacman, grid]);

  // Ghost AI chase movement
  useEffect(() => {
    if (!isPlaying || isGameOver || isGameWon) return;

    const interval = setInterval(() => {
      // Find moves that get closer to Pacman
      const moves = [
        { r: -1, c: 0 }, // Up
        { r: 1, c: 0 },  // Down
        { r: 0, c: -1 }, // Left
        { r: 0, c: 1 },  // Right
      ];

      let bestMove = { r: 0, c: 0 };
      let minDistance = Infinity;

      moves.forEach(move => {
        const nextR = ghost.r + move.r;
        const nextC = ghost.c + move.c;

        if (grid[nextR]?.[nextC] !== 1) {
          // Calculate Manhattan distance to Pacman
          const distance = Math.abs(nextR - pacman.r) + Math.abs(nextC - pacman.c);
          if (distance < minDistance) {
            minDistance = distance;
            bestMove = move;
          }
        }
      });

      const nextGhost = { r: ghost.r + bestMove.r, c: ghost.c + bestMove.c };
      setGhost(nextGhost);

      // Check collision
      if (nextGhost.r === pacman.r && nextGhost.c === pacman.c) {
        setIsGameOver(true);
        setIsPlaying(false);
      }
    }, 450); // Ghost speed

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, isGameWon, ghost, pacman]);

  // Check Win condition (all dots cleared)
  useEffect(() => {
    if (!isPlaying) return;
    const dotsLeft = grid.some(row => row.includes(0));
    if (!dotsLeft) {
      setIsGameWon(true);
      setIsPlaying(false);
    }
  }, [grid, isPlaying]);

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] text-xs font-sans text-black select-none">
      
      {/* Game status header */}
      <div className="bg-[#002040] text-white px-3 py-1.5 flex justify-between items-center text-[11px] font-bold font-sans">
        <span>Pacman Grid Arcade</span>
        <div className="flex space-x-3.5 font-mono">
          <span>Score: <strong className="text-green-400">{score}</strong></span>
          <span>High Score: <strong className="text-yellow-400">{highScore}</strong></span>
        </div>
      </div>

      <div className="flex-grow p-4 flex flex-col justify-between items-center overflow-auto space-y-4">
        
        {/* Pacman grid structure */}
        <div className="relative border-2 border-[#808080] bg-black p-2.5 rounded shadow-[inset_2px_2px_3px_rgba(0,0,0,0.5)] flex-grow w-full max-w-[75vw] max-h-[60vh] aspect-[11/9] min-w-[198px] min-h-[162px]">
          <div className="grid grid-cols-11 gap-[1px] bg-black w-full h-full">
            {grid.flatMap((row, rIdx) => 
              row.map((cell, cIdx) => {
                const isPacman = pacman.r === rIdx && pacman.c === cIdx;
                const isGhost = ghost.r === rIdx && ghost.c === cIdx;

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className="w-full h-full flex items-center justify-center text-xs relative"
                    style={{
                      backgroundColor: cell === 1 ? '#0033cc' : '#000000', // Blue walls, black paths
                      border: cell === 1 ? '1px solid #0055ff' : 'none'
                    }}
                  >
                    {isPacman && <span className="text-base sm:text-lg select-none leading-none animate-pulse">😮</span>}
                    {isGhost && !isPacman && <span className="text-base sm:text-lg select-none leading-none animate-bounce">👻</span>}
                    {cell === 0 && !isPacman && !isGhost && (
                      <div className="w-1.5 h-1.5 bg-[#facc15] rounded-full"></div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Game Over Screen overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/85 flex flex-col justify-center items-center text-white p-2">
              <span className="text-red-500 font-bold text-[13px] tracking-wide mb-1">GHOST CAUGHT YOU</span>
              <span className="text-gray-300 text-[10px] mb-3">Final Score: {score}</span>
              <button
                onClick={resetGame}
                className="xp-btn-classic px-4 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Restart Game
              </button>
            </div>
          )}

          {/* Win Screen Overlay */}
          {isGameWon && (
            <div className="absolute inset-0 bg-black/85 flex flex-col justify-center items-center text-white p-2">
              <span className="text-green-400 font-bold text-[13px] tracking-wide mb-1">MAZE CLEARED</span>
              <span className="text-gray-300 text-[10px] mb-3 font-bold text-green-300">Perfect Score! Score: {score}</span>
              <button
                onClick={resetGame}
                className="xp-btn-classic px-4 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Play Again
              </button>
            </div>
          )}

          {/* Start Welcome Screen Overlay */}
          {!isPlaying && !isGameOver && !isGameWon && (
            <div className="absolute inset-0 bg-black/75 flex flex-col justify-center items-center text-white text-center p-2">
              <span className="text-yellow-400 font-bold text-[12.5px] mb-2 select-none">XP PACMAN GRID</span>
              <p className="text-[9.5px] text-gray-400 leading-tight mb-4">
                Use Arrow Keys to guide Pacman 😮.<br />
                Eat all the yellow dots in the maze.<br />
                Dodge the chasing ghost 👻!
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

        {/* Action guidelines footer */}
        <div className="text-[9.5px] text-gray-500 text-center leading-tight">
          💡 <strong>Controls:</strong> Navigate using the keyboard Arrow Keys.
        </div>

      </div>
    </div>
  );
};
