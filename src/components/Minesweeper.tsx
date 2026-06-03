import React, { useState, useEffect } from 'react';

interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export const Minesweeper: React.FC = () => {
  const ROWS = 9;
  const COLS = 9;
  const MINES = 10;

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [minesLeft, setMinesLeft] = useState(MINES);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Initialize Game Board
  const initBoard = () => {
    // Create empty grid
    let newGrid: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      let row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          x: r,
          y: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0
        });
      }
      newGrid.push(row);
    }

    // Plant Mines
    let minesPlanted = 0;
    while (minesPlanted < MINES) {
      const randomRow = Math.floor(Math.random() * ROWS);
      const randomCol = Math.floor(Math.random() * COLS);
      if (!newGrid[randomRow][randomCol].isMine) {
        newGrid[randomRow][randomCol].isMine = true;
        minesPlanted++;
      }
    }

    // Calculate Neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (r + dr >= 0 && r + dr < ROWS && c + dc >= 0 && c + dc < COLS) {
                if (newGrid[r + dr][c + dc].isMine) count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setGameWon(false);
    setMinesLeft(MINES);
    setTimer(0);
    setIsActive(false);
  };

  useEffect(() => {
    initBoard();
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isActive && !gameOver && !gameWon) {
      interval = setInterval(() => {
        setTimer((prev) => Math.min(prev + 1, 999));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, gameOver, gameWon]);

  const revealCell = (r: number, c: number) => {
    if (gameOver || gameWon || grid[r][c].isFlagged || grid[r][c].isRevealed) return;

    // Start timer on first reveal
    if (!isActive) setIsActive(true);

    const newGrid = [...grid.map((row: Cell[]) => [...row])];
    
    // Hit a mine
    if (newGrid[r][c].isMine) {
      newGrid[r][c].isRevealed = true;
      // Reveal all mines
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          if (newGrid[i][j].isMine) {
            newGrid[i][j].isRevealed = true;
          }
        }
      }
      setGrid(newGrid);
      setGameOver(true);
      return;
    }

    // Recursive empty cell reveal
    const reveal = (row: number, col: number) => {
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
      if (newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;

      newGrid[row][col].isRevealed = true;

      if (newGrid[row][col].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(row + dr, col + dc);
          }
        }
      }
    };

    reveal(r, c);

    // Check Win
    let unrevealedSafeCells = 0;
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (!newGrid[i][j].isMine && !newGrid[i][j].isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }

    setGrid(newGrid);
    if (unrevealedSafeCells === 0) {
      setGameWon(true);
    }
  };

  const flagCell = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || gameWon || grid[r][c].isRevealed) return;

    if (!isActive) setIsActive(true);

    const newGrid = [...grid.map((row: Cell[]) => [...row])];
    const isCurrentlyFlagged = newGrid[r][c].isFlagged;
    
    newGrid[r][c].isFlagged = !isCurrentlyFlagged;
    setMinesLeft((prev) => prev + (isCurrentlyFlagged ? 1 : -1));
    setGrid(newGrid);
  };

  const getSmileEmoji = () => {
    if (gameOver) return '😵';
    if (gameWon) return '😎';
    return '🙂';
  };

  const getNumberColor = (num: number) => {
    switch (num) {
      case 1: return 'text-blue-700';
      case 2: return 'text-green-700';
      case 3: return 'text-red-600';
      case 4: return 'text-purple-800';
      case 5: return 'text-red-800';
      case 6: return 'text-teal-700';
      case 7: return 'text-black';
      case 8: return 'text-gray-500';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#D8D4C8] p-4 select-none font-mono">
      {/* Game Outer Border */}
      <div 
        className="p-1.5"
        style={{
          boxShadow: 'inset 1.5px 1.5px 0px #fff, inset -1.5px -1.5px 0px #808080, 2px 2px 4px rgba(0,0,0,0.3)',
          backgroundColor: '#C0C0C0',
          border: '1.5px solid #808080'
        }}
      >
        {/* Score & Smile bar */}
        <div 
          className="flex items-center justify-between px-3 py-1.5 mb-2.5"
          style={{
            boxShadow: 'inset 1.5px 1.5px 0px #808080, inset -1.5px -1.5px 0px #fff',
            backgroundColor: '#C0C0C0'
          }}
        >
          {/* Mine count */}
          <div className="bg-black text-red-500 font-bold px-1.5 py-0.5 rounded text-[16px] w-[50px] text-right font-mono tracking-widest">
            {String(Math.max(0, minesLeft)).padStart(3, '0')}
          </div>

          {/* Reset button (Smile) */}
          <button 
            onClick={initBoard}
            className="text-[17px] w-[26px] h-[26px] flex items-center justify-center border border-[#808080] hover:bg-gray-100 active:bg-gray-200 shadow-sm"
            style={{
              boxShadow: 'inset 1px 1px 0px #fff, 1px 1.5px 1.5px rgba(0,0,0,0.5)',
              backgroundColor: '#C0C0C0'
            }}
          >
            {getSmileEmoji()}
          </button>

          {/* Timer */}
          <div className="bg-black text-red-500 font-bold px-1.5 py-0.5 rounded text-[16px] w-[50px] text-right font-mono tracking-widest">
            {String(timer).padStart(3, '0')}
          </div>
        </div>

        {/* Board Grid */}
        <div 
          className="grid grid-cols-9 gap-[1px] aspect-square w-full h-full max-w-[75vw] max-h-[60vh] min-w-[162px] min-h-[162px]"
          style={{
            boxShadow: 'inset 1.5px 1.5px 0px #808080, inset -1.5px -1.5px 0px #fff',
            backgroundColor: '#808080',
          }}
        >
          {grid.map((row: Cell[], r: number) =>
            row.map((cell: Cell, c: number) => (
              <button
                key={`${r}-${c}`}
                onClick={() => revealCell(r, c)}
                onContextMenu={(e: React.MouseEvent<HTMLButtonElement>) => flagCell(e, r, c)}
                className={`w-full h-full flex items-center justify-center text-[11px] sm:text-[14px] md:text-[18px] font-extrabold focus:outline-none transition-all ${
                  cell.isRevealed 
                    ? 'bg-[#C0C0C0] border-t border-l border-[#808080]' 
                    : 'bg-[#C0C0C0] hover:bg-gray-100 border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080]'
                }`}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    '💣'
                  ) : cell.neighborMines > 0 ? (
                    <span className={getNumberColor(cell.neighborMines)}>{cell.neighborMines}</span>
                  ) : (
                    ''
                  )
                ) : cell.isFlagged ? (
                  '🚩'
                ) : (
                  ''
                )}
              </button>
            ))
          )}
        </div>
      </div>
      
      {/* Game Status Messages */}
      <div className="mt-3 text-center text-[11px] text-[#000000] font-sans">
        {gameWon && <div className="text-green-800 font-bold">🎉 Congratulations! You won!</div>}
        {gameOver && <div className="text-red-700 font-bold">💥 Game Over! Try again.</div>}
        {!gameOver && !gameWon && <div className="text-gray-600">Tip: Right-click to place flag (🚩)</div>}
      </div>
    </div>
  );
};
