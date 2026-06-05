import React, { useState, useEffect, useRef } from 'react';

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  isHit: boolean;
}

export const BrickBreaker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('brick_highscore') || '0', 10);
  });
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  // Ball properties
  const ballRadius = 6;
  const x = useRef(150);
  const y = useRef(180);
  const dx = useRef(2);
  const dy = useRef(-2);

  // Paddle properties
  const paddleHeight = 8;
  const paddleWidth = 60;
  const paddleX = useRef(120);

  // Bricks setup
  const brickRowCount = 3;
  const brickColumnCount = 6;
  const brickWidth = 42;
  const brickHeight = 12;
  const brickPadding = 6;
  const brickOffsetTop = 20;
  const brickOffsetLeft = 15;

  const bricks = useRef<Brick[]>([]);

  const initBricks = () => {
    const arr: Brick[] = [];
    const colors = ['#e53935', '#ffa500', '#4caf50'];
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        arr.push({
          x: brickX,
          y: brickY,
          width: brickWidth,
          height: brickHeight,
          color: colors[r],
          isHit: false,
        });
      }
    }
    bricks.current = arr;
  };

  // Setup game
  const startGame = () => {
    x.current = 150;
    y.current = 185;
    dx.current = 2;
    dy.current = -2.5;
    paddleX.current = 120;
    initBricks();
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setIsGameWon(false);
    setIsPlaying(true);
  };

  // Game Loop inside requestAnimationFrame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background pattern (classic grid)
      ctx.fillStyle = '#0a101d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#1a2536';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 20) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw Bricks
      bricks.current.forEach((brick) => {
        if (!brick.isHit) {
          // Draw bevel border
          ctx.fillStyle = brick.color;
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
          ctx.strokeStyle = '#ffffff50';
          ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        }
      });

      // Draw Ball
      ctx.beginPath();
      ctx.arc(x.current, y.current, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffeb3b';
      ctx.fill();
      ctx.strokeStyle = '#f57f17';
      ctx.stroke();
      ctx.closePath();

      // Draw Paddle
      ctx.fillStyle = '#2196f3';
      ctx.fillRect(paddleX.current, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(paddleX.current, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight);

      if (!isPlaying || isGameOver || isGameWon) return;

      // Ball physics & boundary collisions
      if (x.current + dx.current > canvas.width - ballRadius || x.current + dx.current < ballRadius) {
        dx.current = -dx.current;
      }
      if (y.current + dy.current < ballRadius) {
        dy.current = -dy.current;
      } else if (y.current + dy.current > canvas.height - ballRadius - 5 - paddleHeight) {
        // Paddle collision check
        if (x.current > paddleX.current && x.current < paddleX.current + paddleWidth) {
          // Change angle based on where it hits the paddle
          const relativeHit = (x.current - (paddleX.current + paddleWidth / 2)) / (paddleWidth / 2);
          dx.current = relativeHit * 3.5;
          dy.current = -Math.abs(dy.current); // Reflect upward
        } else if (y.current + dy.current > canvas.height - ballRadius) {
          // Loose a life
          setLives((prevLives) => {
            const nextLives = prevLives - 1;
            if (nextLives === 0) {
              setIsGameOver(true);
              setIsPlaying(false);
            } else {
              // Reset ball position
              x.current = 150;
              y.current = 185;
              dx.current = 2;
              dy.current = -2.5;
              paddleX.current = 120;
            }
            return nextLives;
          });
        }
      }

      // Brick collisions check
      bricks.current.forEach((brick) => {
        if (!brick.isHit) {
          if (
            x.current > brick.x &&
            x.current < brick.x + brick.width &&
            y.current > brick.y &&
            y.current < brick.y + brick.height
          ) {
            dy.current = -dy.current;
            brick.isHit = true;
            setScore((prevScore) => {
              const newScore = prevScore + 10;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('brick_highscore', newScore.toString());
              }
              return newScore;
            });
          }
        }
      });

      // Win check
      const isWon = bricks.current.every((b) => b.isHit);
      if (isWon && bricks.current.length > 0) {
        setIsGameWon(true);
        setIsPlaying(false);
      }

      x.current += dx.current;
      y.current += dy.current;

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, isGameOver, isGameWon]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) * (canvas.width / rect.width);
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX.current = Math.max(0, Math.min(canvas.width - paddleWidth, relativeX - paddleWidth / 2));
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const relativeX = (touch.clientX - rect.left) * (canvas.width / rect.width);
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX.current = Math.max(0, Math.min(canvas.width - paddleWidth, relativeX - paddleWidth / 2));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] text-xs font-sans text-black select-none">
      
      {/* Game status header */}
      <div className="bg-[#002040] text-white px-3 py-1.5 flex justify-between items-center text-[11px] font-bold">
        <span>XP Brick Breaker</span>
        <div className="flex space-x-3.5">
          <span>Lives: <strong className="text-red-400">{'❤️'.repeat(lives)}</strong></span>
          <span>Score: <strong className="text-green-400 font-mono">{score}</strong></span>
          <span>High: <strong className="text-yellow-400 font-mono">{highScore}</strong></span>
        </div>
      </div>

      <div className="flex-grow p-4 flex flex-col justify-between items-center overflow-auto space-y-4">
        
        {/* Canvas Area Container */}
        <div className="relative border-2 border-[#808080] rounded shadow-[inset_2px_2px_3px_rgba(0,0,0,0.5)] flex-grow w-full max-w-[75vw] max-h-[60vh] aspect-[3/2] min-w-[300px] min-h-[200px]">
          <canvas
            ref={canvasRef}
            width={300}
            height={200}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="cursor-none w-full h-full object-contain"
          ></canvas>

          {/* Game Over Screen overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/85 flex flex-col justify-center items-center text-white">
              <span className="text-red-500 font-bold text-[13px] tracking-wide mb-1">GAME OVER</span>
              <span className="text-gray-300 text-[10px] mb-3">Score: {score}</span>
              <button
                onClick={startGame}
                className="xp-btn-classic px-4 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Win Screen Overlay */}
          {isGameWon && (
            <div className="absolute inset-0 bg-black/85 flex flex-col justify-center items-center text-white">
              <span className="text-green-400 font-bold text-[13px] tracking-wide mb-1">VICTORY!</span>
              <span className="text-gray-300 text-[10px] mb-3">You cleared all bricks! Score: {score}</span>
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
              <span className="text-blue-400 font-bold text-[12px] mb-2 select-none">XP BRICK BREAKER</span>
              <p className="text-[9.5px] text-gray-400 leading-tight mb-4">
                Move your mouse pointer over the grid<br />
                to control the sliding blue paddle.<br />
                Prevent the yellow ball from falling!
              </p>
              <button
                onClick={startGame}
                className="xp-btn-classic px-5 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Start Game
              </button>
            </div>
          )}
        </div>

        {/* Instructions footer text */}
        <div className="text-[9.5px] text-gray-500 text-center leading-tight">
          💡 <strong>Controls:</strong> Slide your mouse or swipe your finger left and right on the screen to control the blue paddle.
        </div>

      </div>
    </div>
  );
};
