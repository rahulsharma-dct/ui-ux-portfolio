import React, { useState, useEffect, useRef } from 'react';

interface Invader {
  x: number;
  y: number;
  width: number;
  height: number;
  isAlive: boolean;
}

interface Laser {
  x: number;
  y: number;
  radius: number;
  speed: number;
  isAlive: boolean;
}

export const SpaceInvaders: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('invaders_highscore') || '0', 10);
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  const canvasWidth = 300;
  const canvasHeight = 200;

  // Ship properties
  const shipWidth = 24;
  const shipHeight = 10;
  const shipX = useRef(138);

  // Lasers and Invaders arrays
  const lasers = useRef<Laser[]>([]);
  const invaders = useRef<Invader[]>([]);
  const invaderDirection = useRef(1); // 1 = right, -1 = left
  const invaderSpeed = 0.5;

  const initInvaders = () => {
    const arr: Invader[] = [];
    const rows = 3;
    const cols = 6;
    const invaderW = 18;
    const invaderH = 12;
    const paddingX = 14;
    const paddingY = 8;
    const offsetX = 30;
    const offsetY = 20;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * (invaderW + paddingX) + offsetX;
        const y = r * (invaderH + paddingY) + offsetY;
        arr.push({ x, y, width: invaderW, height: invaderH, isAlive: true });
      }
    }
    invaders.current = arr;
    lasers.current = [];
    invaderDirection.current = 1;
  };

  const startGame = () => {
    shipX.current = 138;
    setScore(0);
    setIsGameOver(false);
    setIsGameWon(false);
    initInvaders();
    setIsPlaying(true);
  };

  // Keyboard controls tracking
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.key)) {
        e.preventDefault();
      }
      keysPressed.current[e.key] = true;

      // Shoot laser on Space
      if (e.code === 'Space' && isPlaying && !isGameOver && !isGameWon) {
        lasers.current.push({
          x: shipX.current + shipWidth / 2,
          y: canvasHeight - shipHeight - 8,
          radius: 2,
          speed: 4,
          isAlive: true
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, isGameOver, isGameWon]);

  // Main game tick loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const gameTick = () => {
      // Clear
      ctx.fillStyle = '#060a17';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw starry background (retro stars)
      ctx.fillStyle = '#ffffff60';
      ctx.fillRect(40, 30, 2, 2);
      ctx.fillRect(120, 80, 1.5, 1.5);
      ctx.fillRect(260, 45, 2, 2);
      ctx.fillRect(80, 140, 1.5, 1.5);
      ctx.fillRect(220, 130, 2, 2);

      // Draw Ship
      ctx.fillStyle = '#60a5fa'; // Blue ship
      ctx.beginPath();
      ctx.moveTo(shipX.current + shipWidth / 2, canvasHeight - shipHeight - 6);
      ctx.lineTo(shipX.current, canvasHeight - 6);
      ctx.lineTo(shipX.current + shipWidth, canvasHeight - 6);
      ctx.fill();
      // Draw Gun barrel
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(shipX.current + shipWidth / 2 - 1.5, canvasHeight - shipHeight - 10, 3, 4);

      if (isPlaying && !isGameOver && !isGameWon) {
        // Ship movement controls
        if (keysPressed.current['ArrowLeft']) {
          shipX.current = Math.max(0, shipX.current - 2.5);
        }
        if (keysPressed.current['ArrowRight']) {
          shipX.current = Math.min(canvasWidth - shipWidth, shipX.current + 2.5);
        }

        // Update lasers
        lasers.current.forEach((laser) => {
          laser.y -= laser.speed;
          if (laser.y < 0) laser.isAlive = false;
        });

        // Laser collisions with invaders
        lasers.current.forEach((laser) => {
          if (!laser.isAlive) return;
          invaders.current.forEach((invader) => {
            if (!invader.isAlive) return;

            if (
              laser.x > invader.x &&
              laser.x < invader.x + invader.width &&
              laser.y > invader.y &&
              laser.y < invader.y + invader.height
            ) {
              invader.isAlive = false;
              laser.isAlive = false;
              setScore((prev) => {
                const newScore = prev + 20;
                if (newScore > highScore) {
                  setHighScore(newScore);
                  localStorage.setItem('invaders_highscore', newScore.toString());
                }
                return newScore;
              });
            }
          });
        });

        // Filter active lasers
        lasers.current = lasers.current.filter((l) => l.isAlive);

        // Move Invaders
        let changeDirection = false;
        invaders.current.forEach((invader) => {
          if (!invader.isAlive) return;
          
          invader.x += invaderSpeed * invaderDirection.current;

          // Check wall bounce boundaries
          if (invader.x + invader.width > canvasWidth - 10 || invader.x < 10) {
            changeDirection = true;
          }
        });

        if (changeDirection) {
          invaderDirection.current = -invaderDirection.current;
          invaders.current.forEach((invader) => {
            if (!invader.isAlive) return;
            invader.y += 10; // Shift down
            
            // Check fail landing condition
            if (invader.y + invader.height >= canvasHeight - shipHeight - 6) {
              setIsGameOver(true);
              setIsPlaying(false);
            }
          });
        }

        // Win verification
        const won = invaders.current.every((inv) => !inv.isAlive);
        if (won && invaders.current.length > 0) {
          setIsGameWon(true);
          setIsPlaying(false);
        }
      }

      // Draw Lasers
      ctx.fillStyle = '#ef4444'; // Red laser
      lasers.current.forEach((laser) => {
        ctx.beginPath();
        ctx.arc(laser.x, laser.y, laser.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });

      // Draw Invaders
      invaders.current.forEach((invader) => {
        if (!invader.isAlive) return;
        // Draw green alien block
        ctx.fillStyle = '#22c55e'; // Green
        ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
        
        // Draw small invader "eyes"
        ctx.fillStyle = '#060a17';
        ctx.fillRect(invader.x + 3, invader.y + 3, 2, 2);
        ctx.fillRect(invader.x + invader.width - 5, invader.y + 3, 2, 2);
      });

      animationId = requestAnimationFrame(gameTick);
    };

    gameTick();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, isGameOver, isGameWon]);

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] text-xs font-sans text-black select-none">
      
      {/* Game status header */}
      <div className="bg-[#002040] text-white px-3 py-1.5 flex justify-between items-center text-[11px] font-bold">
        <span>XP Space Defender</span>
        <div className="flex space-x-3.5 font-mono">
          <span>Score: <strong className="text-green-400">{score}</strong></span>
          <span>High Score: <strong className="text-yellow-400">{highScore}</strong></span>
        </div>
      </div>

      <div className="flex-grow p-4 flex flex-col justify-between items-center overflow-auto space-y-4">
        
        {/* Canvas container */}
        <div className="relative border-2 border-[#808080] rounded shadow-[inset_2px_2px_3px_rgba(0,0,0,0.5)] flex-grow w-full max-w-[75vw] max-h-[60vh] aspect-[3/2] min-w-[300px] min-h-[200px]">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="w-full h-full object-contain"
          ></canvas>

          {/* Game Over Screen overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/85 flex flex-col justify-center items-center text-white p-2">
              <span className="text-red-500 font-bold text-[13px] tracking-wide mb-1">DEFENSE FAILED</span>
              <span className="text-gray-300 text-[10px] mb-3">Score: {score}</span>
              <button
                onClick={startGame}
                className="xp-btn-classic px-4 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Restart Game
              </button>
            </div>
          )}

          {/* Win Screen Overlay */}
          {isGameWon && (
            <div className="absolute inset-0 bg-black/85 flex flex-col justify-center items-center text-white p-2">
              <span className="text-green-400 font-bold text-[13px] tracking-wide mb-1">SECTORS SECURED</span>
              <span className="text-gray-300 text-[10px] mb-3">Final Score: {score}</span>
              <button
                onClick={startGame}
                className="xp-btn-classic px-4 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Play Again
              </button>
            </div>
          )}

          {/* Start Welcome Screen Overlay */}
          {!isPlaying && !isGameOver && !isGameWon && (
            <div className="absolute inset-0 bg-black/75 flex flex-col justify-center items-center text-white text-center p-2">
              <span className="text-blue-400 font-bold text-[12px] mb-2 select-none">XP SPACE DEFENDER</span>
              <p className="text-[9.5px] text-gray-400 leading-tight mb-4">
                Use Left / Right arrow keys to steer ship.<br />
                Press <strong>Spacebar</strong> to launch lasers.<br />
                Destroy all incoming green invaders!
              </p>
              <button
                onClick={startGame}
                className="xp-btn-classic px-5 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Launch Defense
              </button>
            </div>
          )}
        </div>

        {/* Action guidelines footer */}
        <div className="text-[9.5px] text-gray-500 text-center leading-tight">
          💡 <strong>Controls:</strong> Steering with Left / Right Arrows. Laser launch with Spacebar.
        </div>

      </div>
    </div>
  );
};
