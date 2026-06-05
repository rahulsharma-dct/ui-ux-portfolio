import React, { useState, useEffect, useRef } from 'react';

interface Obstacle {
  x: number;
  width: number;
  height: number;
  passed: boolean;
}

export const DinoRun: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('dinorun_highscore') || '0', 10);
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const canvasWidth = 300;
  const canvasHeight = 150;

  // Clippy character properties
  const clippyY = useRef(canvasHeight - 30);
  const clippyVelocityY = useRef(0);
  const clippyX = 30;
  const clippyHeight = 24;
  const clippyWidth = 16;
  const gravity = 0.35;
  const jumpForce = -6.0;
  const isJumping = useRef(false);

  // Obstacles setup
  const obstacles = useRef<Obstacle[]>([]);
  const minObstacleInterval = 80;
  const frameCount = useRef(0);
  const nextSpawnFrame = useRef(80);
  const gameSpeed = useRef(2.5);

  const spawnObstacle = () => {
    const height = Math.floor(Math.random() * 20) + 15; // 15 to 35 height
    const width = 10;
    obstacles.current.push({
      x: canvasWidth,
      width,
      height,
      passed: false
    });
  };

  const handleJump = () => {
    if (!isPlaying) {
      if (isGameOver) {
        resetGame();
      } else {
        setIsPlaying(true);
      }
      return;
    }

    if (!isJumping.current) {
      clippyVelocityY.current = jumpForce;
      isJumping.current = true;
    }
  };

  const resetGame = () => {
    clippyY.current = canvasHeight - 30;
    clippyVelocityY.current = 0;
    isJumping.current = false;
    obstacles.current = [];
    gameSpeed.current = 2.5;
    frameCount.current = 0;
    nextSpawnFrame.current = 80;
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  // Keyboard Space/Up support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        handleJump();
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
      // Clear
      ctx.fillStyle = '#ece9d8'; // Light beige standard XP window
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw Horizon/Ground Line
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvasHeight - 6);
      ctx.lineTo(canvasWidth, canvasHeight - 6);
      ctx.stroke();

      // Draw moving ground lines (simulating speed)
      ctx.strokeStyle = '#a0a0a0';
      ctx.lineWidth = 1;
      const speedOffset = (frameCount.current * gameSpeed.current) % 60;
      for (let i = canvasWidth - speedOffset; i > 0; i -= 60) {
        ctx.beginPath();
        ctx.moveTo(i, canvasHeight - 4);
        ctx.lineTo(i - 10, canvasHeight - 4);
        ctx.stroke();
      }

      if (isPlaying && !isGameOver) {
        // Apply physics
        clippyVelocityY.current += gravity;
        clippyY.current += clippyVelocityY.current;

        // Ground constraint checks
        const groundY = canvasHeight - clippyHeight - 6;
        if (clippyY.current >= groundY) {
          clippyY.current = groundY;
          clippyVelocityY.current = 0;
          isJumping.current = false;
        }

        // Spawn obstacles
        frameCount.current++;
        if (frameCount.current >= nextSpawnFrame.current) {
          spawnObstacle();
          // Randomize next spawn frame
          nextSpawnFrame.current = frameCount.current + Math.floor(Math.random() * 60) + minObstacleInterval;
          // Slowly accelerate game speed
          gameSpeed.current += 0.05;
        }

        // Update obstacles
        obstacles.current.forEach((obs) => {
          obs.x -= gameSpeed.current;

          // Collisions checking
          const clippyRight = clippyX + clippyWidth;
          const clippyLeft = clippyX;
          const clippyBottom = clippyY.current + clippyHeight;

          const obsLeft = obs.x;
          const obsRight = obs.x + obs.width;
          const obsTop = canvasHeight - obs.height - 6;

          if (
            clippyRight > obsLeft &&
            clippyLeft < obsRight &&
            clippyBottom > obsTop
          ) {
            triggerGameOver();
          }

          // Score check
          if (!obs.passed && obs.x + obs.width < clippyX) {
            obs.passed = true;
            setScore((prev) => {
              const newScore = prev + 10;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('dinorun_highscore', newScore.toString());
              }
              return newScore;
            });
          }
        });

        // Filter offscreen obstacles
        obstacles.current = obstacles.current.filter((obs) => obs.x + obs.width > 0);
      }

      // Draw Obstacles (red pencil holders/cacti)
      ctx.fillStyle = '#ef4444'; // Red
      obstacles.current.forEach((obs) => {
        const obsY = canvasHeight - obs.height - 6;
        ctx.fillRect(obs.x, obsY, obs.width, obs.height);
        
        // Draw details on the obstacle
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(obs.x + 2, obsY + 2, obs.width - 4, obs.height - 4);
        ctx.fillStyle = '#ef4444';
      });

      // Draw Running Clippy (Paperclip character)
      ctx.save();
      ctx.font = '22px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      
      // Bouncing animation when running
      const runOffset = isPlaying && !isJumping.current && (Math.floor(frameCount.current / 8) % 2 === 0) ? -2 : 0;
      ctx.fillText('📎', clippyX, clippyY.current + runOffset);
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
      {/* Game status header */}
      <div className="bg-[#002040] text-white px-3 py-1.5 flex justify-between items-center text-[11px] font-bold">
        <span>Clippy Runner (Dino Run)</span>
        <div className="flex space-x-3.5 font-mono">
          <span>Score: <strong className="text-green-400">{score}</strong></span>
          <span>High Score: <strong className="text-yellow-400">{highScore}</strong></span>
        </div>
      </div>

      <div className="flex-grow p-4 flex flex-col justify-between items-center overflow-auto space-y-4">
        
        {/* Canvas container */}
        <div className="relative border-2 border-[#808080] rounded shadow-[inset_2px_2px_3px_rgba(0,0,0,0.5)] flex-grow w-full max-w-[75vw] max-h-[60vh] aspect-[2/1] min-w-[300px] min-h-[150px]">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            onClick={handleJump}
            className="cursor-pointer w-full h-full object-contain"
          ></canvas>

          {/* Game Over Screen overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/85 flex flex-col justify-center items-center text-white p-2">
              <span className="text-red-500 font-bold text-[13px] tracking-wide mb-1">CRASH DETECTED</span>
              <span className="text-gray-300 text-[10px] mb-3">Final score: {score}</span>
              <button
                onClick={resetGame}
                className="xp-btn-classic px-4 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Retry Run
              </button>
            </div>
          )}

          {/* Welcome Screen overlay */}
          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 bg-black/75 flex flex-col justify-center items-center text-white text-center p-2">
              <span className="text-blue-300 font-bold text-[12px] mb-2 select-none">CLIPPY RUNNER</span>
              <p className="text-[9.5px] text-gray-400 leading-tight mb-4">
                Click inside the window box or press<br />
                <strong>Space / Up Arrow</strong> to jump Clippy.<br />
                Evade incoming desk accessories!
              </p>
              <button
                onClick={resetGame}
                className="xp-btn-classic px-5 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Start Runner
              </button>
            </div>
          )}
        </div>

        {/* Mobile Jump Button */}
        <div className="flex sm:hidden w-full max-w-[200px] justify-center">
          <button
            onClick={handleJump}
            className="xp-btn-classic w-full py-2.5 font-bold text-xs rounded active:scale-95 text-black"
          >
            Jump 🚀
          </button>
        </div>

        {/* Action guidelines footer */}
        <div className="text-[9.5px] text-gray-500 text-center leading-tight">
          💡 <strong>Controls:</strong> Press Spacebar or Arrow Up, click canvas, or tap the Jump button to jump.
        </div>

      </div>
    </div>
  );
};
