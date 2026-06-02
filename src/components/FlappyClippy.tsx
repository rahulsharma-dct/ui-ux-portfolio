import React, { useState, useEffect, useRef } from 'react';

interface Obstacle {
  x: number;
  topHeight: number;
  bottomHeight: number;
  width: number;
  passed: boolean;
}

export const FlappyClippy: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('flappy_highscore') || '0', 10);
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Clippy properties
  const clippyY = useRef(100);
  const clippyVelocity = useRef(0);
  const clippyX = 50;
  const clippySize = 16;
  const gravity = 0.25;
  const jumpForce = -4.5;

  // Obstacles setup
  const obstacles = useRef<Obstacle[]>([]);
  const frameCount = useRef(0);

  const spawnObstacle = (canvasWidth: number, canvasHeight: number) => {
    const gap = 65; // Gap size for Clippy to pass
    const minHeight = 20;
    const maxHeight = canvasHeight - gap - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
    const bottomHeight = canvasHeight - topHeight - gap;
    const width = 24;

    obstacles.current.push({
      x: canvasWidth,
      topHeight,
      bottomHeight,
      width,
      passed: false
    });
  };

  const handleFlap = () => {
    if (!isPlaying) {
      if (isGameOver) {
        resetGame();
      } else {
        setIsPlaying(true);
      }
      return;
    }
    clippyVelocity.current = jumpForce;
  };

  const resetGame = () => {
    clippyY.current = 100;
    clippyVelocity.current = 0;
    obstacles.current = [];
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  // Keyboard support for flap (Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleFlap();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver]);

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const gameTick = () => {
      // Clear screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background (blue sky with clouds grid)
      ctx.fillStyle = '#2196f3';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff12';
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.fillRect(i, 0, 1, canvas.height);
      }
      for (let j = 0; j < canvas.height; j += 20) {
        ctx.fillRect(0, j, canvas.width, 1);
      }

      // Physics
      if (isPlaying && !isGameOver) {
        clippyVelocity.current += gravity;
        clippyY.current += clippyVelocity.current;

        // Ground/ceiling collisions
        if (clippyY.current > canvas.height - clippySize || clippyY.current < 0) {
          triggerGameOver();
        }

        // Spawn obstacles
        frameCount.current++;
        if (frameCount.current % 90 === 0) {
          spawnObstacle(canvas.width, canvas.height);
        }

        // Update obstacles position
        obstacles.current.forEach((obs) => {
          obs.x -= 1.5; // Scroll speed

          // Collision check
          const clippyRight = clippyX + clippySize;
          const clippyLeft = clippyX;
          const clippyTop = clippyY.current;
          const clippyBottom = clippyY.current + clippySize;

          const obsLeft = obs.x;
          const obsRight = obs.x + obs.width;

          // Check if Clippy collides with the top pipe or bottom pipe
          if (clippyRight > obsLeft && clippyLeft < obsRight) {
            if (clippyTop < obs.topHeight || clippyBottom > canvas.height - obs.bottomHeight) {
              triggerGameOver();
            }
          }

          // Point score check
          if (!obs.passed && obs.x + obs.width < clippyX) {
            obs.passed = true;
            setScore((prevScore) => {
              const newScore = prevScore + 1;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('flappy_highscore', newScore.toString());
              }
              return newScore;
            });
          }
        });

        // Filter out offscreen obstacles
        obstacles.current = obstacles.current.filter((obs) => obs.x + obs.width > 0);
      }

      // Draw obstacles (Pencil yellow poles)
      obstacles.current.forEach((obs) => {
        // Top pencil
        ctx.fillStyle = '#ffb300';
        ctx.fillRect(obs.x, 0, obs.width, obs.topHeight);
        // Pencil tip representation
        ctx.fillStyle = '#d84315';
        ctx.fillRect(obs.x, obs.topHeight - 4, obs.width, 4);

        // Bottom pencil
        ctx.fillStyle = '#ffb300';
        ctx.fillRect(obs.x, canvas.height - obs.bottomHeight, obs.width, obs.bottomHeight);
        ctx.fillStyle = '#d84315';
        ctx.fillRect(obs.x, canvas.height - obs.bottomHeight, obs.width, 4);
      });

      // Draw Clippy (paperclip)
      ctx.save();
      // Draw Clippy paperclip representation
      ctx.font = '22px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📎', clippyX + clippySize / 2, clippyY.current + clippySize / 2);
      ctx.restore();

      animationId = requestAnimationFrame(gameTick);
    };

    gameTick();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, isGameOver]);

  const triggerGameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] text-xs font-sans text-black select-none">
      
      {/* Status panel */}
      <div className="bg-[#002040] text-white px-3 py-1.5 flex justify-between items-center text-[11px] font-bold">
        <span>Flappy Clippy</span>
        <div className="flex space-x-3.5">
          <span>Score: <strong className="text-green-400 font-mono">{score}</strong></span>
          <span>High Score: <strong className="text-yellow-400 font-mono">{highScore}</strong></span>
        </div>
      </div>

      <div className="flex-grow p-4 flex flex-col justify-between items-center overflow-auto space-y-4">
        
        {/* Canvas container */}
        <div className="relative border-2 border-[#808080] rounded shadow-[inset_2px_2px_3px_rgba(0,0,0,0.5)] flex-grow w-full max-w-[75vw] max-h-[60vh] aspect-[3/2] min-w-[300px] min-h-[200px]">
          <canvas
            ref={canvasRef}
            width={300}
            height={200}
            onClick={handleFlap}
            className="cursor-pointer w-full h-full object-contain"
          ></canvas>

          {/* Game Over Screen Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center text-white p-2">
              <span className="text-red-500 font-bold text-[13px] tracking-wide mb-1">GAME OVER</span>
              <span className="text-gray-300 text-[10px] mb-3">Score: {score}</span>
              <button
                onClick={resetGame}
                className="xp-btn-classic px-4 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Welcome Screen Overlay */}
          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 bg-black/75 flex flex-col justify-center items-center text-white text-center p-2">
              <span className="text-blue-300 font-bold text-[12.5px] mb-2 select-none">FLAPPY CLIPPY</span>
              <p className="text-[9.5px] text-gray-400 leading-tight mb-4">
                Click inside the window box or press<br />
                <strong>Spacebar</strong> to flap Clippy up.<br />
                Avoid hitting the yellow pencils!
              </p>
              <button
                onClick={resetGame}
                className="xp-btn-classic px-5 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Flap to Start
              </button>
            </div>
          )}
        </div>

        {/* Action guidelines footer */}
        <div className="text-[9.5px] text-gray-500 text-center leading-tight">
          💡 <strong>Controls:</strong> Press Spacebar or left-click inside the grid to flap Clippy upwards.
        </div>

      </div>
    </div>
  );
};
