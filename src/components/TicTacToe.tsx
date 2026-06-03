import React, { useState, useEffect } from 'react';

export const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [clippySpeech, setClippySpeech] = useState<string>(
    "It looks like you want to play Tic Tac Toe! I can help you with that. Click on any box to start!"
  );
  const [stats, setStats] = useState({ player: 0, clippy: 0, draws: 0 });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  // Helper to check for a winner
  const checkWinner = (currentBoard: (string | null)[]) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return null;
  };

  // Clippy AI Move
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!isPlayerTurn && !winner && !isDraw) {
      setClippySpeech("Let me think... My paperclip gears are spinning!");
      
      timer = setTimeout(() => {
        const bestMove = getBestMove(board);
        const newBoard = [...board];
        newBoard[bestMove] = 'O';
        setBoard(newBoard);

        const gameWinner = checkWinner(newBoard);
        const gameDraw = !gameWinner && newBoard.every(cell => cell !== null);

        if (gameWinner) {
          setWinner(gameWinner);
          setStats(prev => ({ ...prev, clippy: prev.clippy + 1 }));
          setClippySpeech("It looks like I won! Would you like some tips on how to play Tic-Tac-Toe?");
        } else if (gameDraw) {
          setIsDraw(true);
          setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
          setClippySpeech("It's a draw! How about a rematch to break the tie?");
        } else {
          setIsPlayerTurn(true);
          const taunts = [
            "Your turn! Try to block me if you can.",
            "Hmm, that was a bold move. Let's see how you handle this!",
            "I've calculated 4,000 possible futures, and they all look shiny for me!",
            "Are you sure about that move?",
            "Just a tip: losing is a great way to learn!"
          ];
          setClippySpeech(taunts[Math.floor(Math.random() * taunts.length)]);
        }
      }, 800);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlayerTurn, board, winner, isDraw]);

  // MiniMax Algorithm for AI
  const getBestMove = (currentBoard: (string | null)[]): number => {
    // 1. Can AI Win in this turn?
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const boardCopy = [...currentBoard];
        boardCopy[i] = 'O';
        if (checkWinner(boardCopy) === 'O') return i;
      }
    }

    // 2. Can Player Win in next turn? Block them!
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const boardCopy = [...currentBoard];
        boardCopy[i] = 'X';
        if (checkWinner(boardCopy) === 'X') return i;
      }
    }

    // 3. Take Center if available
    if (currentBoard[4] === null) return 4;

    // 4. Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => currentBoard[i] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // 5. Take whatever is left
    const emptyIndices = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  };

  const handleCellClick = (index: number) => {
    if (board[index] || !isPlayerTurn || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    const gameDraw = !gameWinner && newBoard.every(cell => cell !== null);

    if (gameWinner) {
      setWinner(gameWinner);
      setStats(prev => ({ ...prev, player: prev.player + 1 }));
      setClippySpeech("Wow, you won! My paperclip brain must be rusty. Congratulations!");
    } else if (gameDraw) {
      setIsDraw(true);
      setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
      setClippySpeech("A draw! An excellent battle of wits.");
    } else {
      setIsPlayerTurn(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setIsDraw(false);
    setClippySpeech("New game started! I will let you go first this time.");
  };

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] text-xs font-sans text-black select-none">
      
      {/* Top Banner Game Status */}
      <div className="bg-[#002040] text-white px-3 py-1.5 flex justify-between items-center text-[11px] font-bold">
        <span>Tic Tac Toe - Clippy Edition</span>
        <div className="flex space-x-3">
          <span>You (X): <strong className="text-green-400">{stats.player}</strong></span>
          <span>Clippy (O): <strong className="text-red-400">{stats.clippy}</strong></span>
          <span>Draws: <strong>{stats.draws}</strong></span>
        </div>
      </div>

      <div className="flex-grow p-4 flex flex-col md:flex-row items-center md:items-stretch justify-between space-y-4 md:space-y-0 md:space-x-4 overflow-auto">
        
        {/* Game Grid Box */}
        <div className="flex flex-col justify-center items-center flex-grow bg-white border border-[#808080] p-4 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] w-full max-w-[75vw] max-h-[55vh] aspect-square min-w-[210px] min-h-[210px]">
          <div className="grid grid-cols-3 gap-2 w-full h-full">
            {board.map((cell, idx) => (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                className={`w-full h-full rounded border flex items-center justify-center text-3xl sm:text-5xl md:text-6xl font-bold cursor-pointer transition-all ${
                  cell === null 
                    ? 'bg-[#ECE9D8] border-[#808080] hover:bg-[#E2DFD3] active:bg-[#C0BCAE] shadow-[inset_1px_1px_0px_#fff]' 
                    : cell === 'X' 
                      ? 'bg-blue-50 border-[#0055e5] text-[#0055e5] shadow-[inset_1px_1px_2px_rgba(0,85,229,0.2)]'
                      : 'bg-red-50 border-[#CC0000] text-[#CC0000] shadow-[inset_1px_1px_2px_rgba(204,0,0,0.2)]'
                }`}
                style={{
                  fontFamily: 'Outfit, Arial, sans-serif'
                }}
              >
                {cell === 'X' && '❌'}
                {cell === 'O' && '⭕'}
              </button>
            ))}
          </div>

          <button
            onClick={resetGame}
            className="xp-btn-classic mt-4 px-6 py-1.5 font-bold border border-[#707070] bg-[#ECE9D8] hover:bg-[#E2DFD3] active:bg-[#C0BCAE] rounded shadow-xs cursor-pointer text-black"
          >
            Reset Board
          </button>
        </div>

        {/* Clippy Assistant Box */}
        <div className="w-full md:w-[180px] flex flex-col justify-between items-center bg-[#FFFFCC] border border-[#CCCCCC] p-3 rounded-lg shadow-sm relative shrink-0">
          
          {/* Clippy Text Bubble */}
          <div className="bg-white border border-gray-400 p-2.5 rounded-lg text-[10.5px] leading-relaxed shadow-xs relative mb-4">
            {clippySpeech}
            {/* Small speech bubble arrow */}
            <div className="absolute left-1/2 md:left-auto md:right-full top-full md:top-1/2 -mt-1 md:-mt-2 w-0 h-0 border-[6px] border-transparent border-t-white md:border-t-transparent md:border-r-white filter drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]"></div>
          </div>

          {/* Clippy Figure Avatar */}
          <div className="flex flex-col items-center select-none">
            {/* Paperclip Emoji Representation */}
            <div className="text-6xl animate-bounce duration-[2000ms] cursor-pointer" title="Clippy">
              📎
            </div>
            {/* Goofy Googly Eyes */}
            <div className="flex space-x-1 -mt-11 mb-6 bg-white px-1.5 py-0.5 rounded border border-gray-300 shadow-2xs select-none">
              <span className="text-[10px]">👁️👁️</span>
            </div>
            <span className="font-bold text-[10px] text-gray-500">Clippy Assistant</span>
          </div>

        </div>

      </div>
    </div>
  );
};
