import React, { useState, useEffect, useRef } from 'react';

export const Pong: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const canvasWidth = 300;
  const canvasHeight = 180;

  // Ball properties
  const ballX = useRef(150);
  const ballY = useRef(90);
  const ballSize = 6;
  const ballSpeedX = useRef(2.5);
  const ballSpeedY = useRef(1.5);

  // Paddle properties
  const paddleWidth = 8;
  const paddleHeight = 40;
  const playerY = useRef(70);
  const computerY = useRef(70);
  const computerSpeed = 1.8;

  const resetBall = (direction: number) => {
    ballX.current = canvasWidth / 2;
    ballY.current = canvasHeight / 2;
    ballSpeedX.current = direction * 2.5;
    ballSpeedY.current = (Math.random() * 2 - 1) * 2;
  };

  const startGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setWinner(null);
    resetBall(1);
    setIsPlaying(true);
  };

  // Keyboard control tracking
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.key)) {
        e.preventDefault();
      }
      keysPressed.current[e.key] = true;
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
  }, []);

  // Mouse control support over the canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeY = (e.clientY - rect.top) * (canvasHeight / rect.height);
    playerY.current = Math.max(0, Math.min(canvasHeight - paddleHeight, relativeY - paddleHeight / 2));
  };

  // Main game tick loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const gameTick = () => {
      // Clear
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw Center Dashed Line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(canvasWidth / 2, 0);
      ctx.lineTo(canvasWidth / 2, canvasHeight);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Draw Player Paddle (Left)
      ctx.fillStyle = '#22c55e'; // Green
      ctx.fillRect(10, playerY.current, paddleWidth, paddleHeight);

      // Draw Computer Paddle (Right)
      ctx.fillStyle = '#ef4444'; // Red
      ctx.fillRect(canvasWidth - 10 - paddleWidth, computerY.current, paddleWidth, paddleHeight);

      // Draw Ball
      ctx.fillStyle = '#facc15'; // Yellow
      ctx.beginPath();
      ctx.arc(ballX.current, ballY.current, ballSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      if (isPlaying && !winner) {
        // Player keyboard controls
        if (keysPressed.current['ArrowUp']) {
          playerY.current = Math.max(0, playerY.current - 3);
        }
        if (keysPressed.current['ArrowDown']) {
          playerY.current = Math.min(canvasHeight - paddleHeight, playerY.current + 3);
        }

        // Computer AI tracking
        const ballTargetY = ballY.current - paddleHeight / 2;
        if (computerY.current < ballTargetY) {
          computerY.current = Math.min(canvasHeight - paddleHeight, computerY.current + computerSpeed);
        } else if (computerY.current > ballTargetY) {
          computerY.current = Math.max(0, computerY.current - computerSpeed);
        }

        // Ball movement
        ballX.current += ballSpeedX.current;
        ballY.current += ballSpeedY.current;

        // Wall collisions (Top/Bottom)
        if (ballY.current - ballSize < 0 || ballY.current + ballSize > canvasHeight) {
          ballSpeedY.current = -ballSpeedY.current;
        }

        // Paddle collisions (Left/Player)
        if (
          ballX.current - ballSize <= 10 + paddleWidth &&
          ballX.current + ballSize >= 10 &&
          ballY.current + ballSize >= playerY.current &&
          ballY.current - ballSize <= playerY.current + paddleHeight
        ) {
          ballX.current = 10 + paddleWidth + ballSize; // Snap to paddle
          ballSpeedX.current = Math.abs(ballSpeedX.current) + 0.25; // increase speed slightly
          // Angled bounces
          const hitPos = ballY.current - (playerY.current + paddleHeight / 2);
          const relativeHit = hitPos / (paddleHeight / 2);
          ballSpeedY.current = relativeHit * 3.0;
        }

        // Paddle collisions (Right/Computer)
        if (
          ballX.current + ballSize >= canvasWidth - 10 - paddleWidth &&
          ballX.current - ballSize <= canvasWidth - 10 &&
          ballY.current + ballSize >= computerY.current &&
          ballY.current - ballSize <= computerY.current + paddleHeight
        ) {
          ballX.current = canvasWidth - 10 - paddleWidth - ballSize; // Snap to paddle
          ballSpeedX.current = -(Math.abs(ballSpeedX.current) + 0.25);
          const hitPos = ballY.current - (computerY.current + paddleHeight / 2);
          const relativeHit = hitPos / (paddleHeight / 2);
          ballSpeedY.current = relativeHit * 3.0;
        }

        // Score outcomes
        if (ballX.current < 0) {
          // Computer scores
          setComputerScore((prev) => {
            const nextScore = prev + 1;
            if (nextScore >= 5) {
              setWinner('Clippy');
              setIsPlaying(false);
            } else {
              resetBall(1);
            }
            return nextScore;
          });
        } else if (ballX.current > canvasWidth) {
          // Player scores
          setPlayerScore((prev) => {
            const nextScore = prev + 1;
            if (nextScore >= 5) {
              setWinner('Player');
              setIsPlaying(false);
            } else {
              resetBall(-1);
            }
            return nextScore;
          });
        }
      }

      animationId = requestAnimationFrame(gameTick);
    };

    gameTick();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, winner]);

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] text-xs font-sans text-black select-none">
      {/* Header status bar */}
      <div className="bg-[#002040] text-white px-3 py-1.5 flex justify-between items-center text-[11px] font-bold">
        <span>XP Pong Table</span>
        <div className="flex space-x-4 font-mono">
          <span>You: <strong className="text-green-400">{playerScore}</strong></span>
          <span>Computer: <strong className="text-red-400">{computerScore}</strong></span>
        </div>
      </div>

      <div className="flex-grow p-4 flex flex-col justify-between items-center overflow-auto space-y-4">

        {/* Canvas container */}
        <div className="relative border-2 border-[#808080] rounded shadow-[inset_2px_2px_3px_rgba(0,0,0,0.5)] flex-grow w-full max-w-[75vw] max-h-[60vh] aspect-[5/3] min-w-[300px] min-h-[180px]">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            onMouseMove={handleMouseMove}
            className="cursor-crosshair w-full h-full object-contain"
          ></canvas>

          {/* Winner display overlay */}
          {winner && (
            <div className="absolute inset-0 bg-black/85 flex flex-col justify-center items-center text-white p-2">
              <span className={`font-bold text-[13px] tracking-wide mb-1 ${winner === 'Player' ? 'text-green-400' : 'text-red-500'}`}>
                {winner === 'Player' ? 'YOU WIN!' : 'CLIPPY WINS!'}
              </span>
              <span className="text-gray-300 text-[10px] mb-3">Final Match Score: {playerScore} - {computerScore}</span>
              <button
                onClick={startGame}
                className="xp-btn-classic px-4 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Rematch
              </button>
            </div>
          )}

          {/* Welcome Screen overlay */}
          {!isPlaying && !winner && (
            <div className="absolute inset-0 bg-black/75 flex flex-col justify-center items-center text-white text-center p-2">
              <span className="text-green-400 font-bold text-[12px] mb-2 select-none">XP CLASSIC PONG</span>
              <p className="text-[9.5px] text-gray-400 leading-tight mb-4">
                Use Arrow Keys (Up/Down) or slide your<br />
                mouse vertically over the canvas grid<br />
                to control the green left paddle. First to 5 wins!
              </p>
              <button
                onClick={startGame}
                className="xp-btn-classic px-5 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Play Pong
              </button>
            </div>
          )}
        </div>

        {/* Action guidelines footer */}
        <div className="text-[9.5px] text-gray-500 text-center leading-tight">
          💡 <strong>Controls:</strong> Arrow Up / Down, or slide your mouse cursor vertically inside the frame.
        </div>

      </div>
    </div>
  );
};
