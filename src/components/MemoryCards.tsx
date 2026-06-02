import React, { useState, useEffect } from 'react';

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_ICONS = ['📎', '💻', '🗑️', '🎨', '💣', '📝', '🌐', '❤️'];

export const MemoryCards: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('memory_bestscore') || '999', 10);
  });
  const [isGameWon, setIsGameWon] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize and Shuffle Cards
  const initGame = () => {
    const doubleIcons = [...CARD_ICONS, ...CARD_ICONS];
    // Fisher-Yates Shuffle
    for (let i = doubleIcons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [doubleIcons[i], doubleIcons[j]] = [doubleIcons[j], doubleIcons[i]];
    }

    const shuffledCards = doubleIcons.map((icon, idx) => ({
      id: idx,
      icon,
      isFlipped: false,
      isMatched: false
    }));

    setCards(shuffledCards);
    setSelectedCards([]);
    setMoves(0);
    setIsGameWon(false);
    setIsPlaying(true);
  };

  const handleCardClick = (id: number) => {
    if (!isPlaying || isGameWon) return;
    
    // Ignore if already flipped/matched or already selected
    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched || selectedCards.includes(id)) return;

    // Flip card
    setCards(prevCards => 
      prevCards.map(c => c.id === id ? { ...c, isFlipped: true } : c)
    );

    const nextSelected = [...selectedCards, id];
    setSelectedCards(nextSelected);

    if (nextSelected.length === 2) {
      setMoves(prev => prev + 1);
      const [firstId, secondId] = nextSelected;
      const card1 = cards.find(c => c.id === firstId);
      const card2 = cards.find(c => c.id === secondId);

      if (card1 && card2 && card1.icon === card2.icon) {
        // Match found
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(c => 
              c.id === firstId || c.id === secondId 
                ? { ...c, isMatched: true } 
                : c
            )
          );
          setSelectedCards([]);
        }, 300);
      } else {
        // No match, flip back
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(c => 
              c.id === firstId || c.id === secondId 
                ? { ...c, isFlipped: false } 
                : c
            )
          );
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  // Check Win condition
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setIsGameWon(true);
      setIsPlaying(false);
      if (moves < bestScore) {
        setBestScore(moves);
        localStorage.setItem('memory_bestscore', moves.toString());
      }
    }
  }, [cards, moves, bestScore]);

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] text-xs font-sans text-black select-none">
      
      {/* Game Header Status Bar */}
      <div className="bg-[#002040] text-white px-3 py-1.5 flex justify-between items-center text-[11px] font-bold">
        <span>Solitaire Memory Match</span>
        <div className="flex space-x-4">
          <span>Flips: <strong className="text-green-400 font-mono">{moves}</strong></span>
          <span>Best Flips: <strong className="text-yellow-400 font-mono">{bestScore === 999 ? 'N/A' : bestScore}</strong></span>
        </div>
      </div>

      <div className="flex-grow p-4 flex flex-col items-center justify-between overflow-auto space-y-4">
        
        {/* Game Cards Grid (4x4) */}
        <div className="bg-white border-2 border-[#808080] p-3.5 rounded shadow-[inset_1.5px_1.5px_2px_rgba(0,0,0,0.1)] flex-grow w-full max-w-[70vw] max-h-[55vh] aspect-[4/5] min-w-[220px] min-h-[250px] relative">
          <div className="grid grid-cols-4 gap-2 w-full h-full">
            {cards.map((card) => {
              const showFront = card.isFlipped || card.isMatched;
              
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`w-full h-full rounded border flex items-center justify-center text-2xl sm:text-3xl font-bold cursor-pointer transition-all duration-150 relative ${
                    showFront
                      ? 'bg-blue-50 border-gray-400 rotate-0 shadow-[inset_1px_1px_1px_#fff]'
                      : 'bg-gradient-to-br bg-[#245DDA] border-[#1C40A3] rotate-180 hover:brightness-105 active:brightness-95'
                  }`}
                  style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                    boxShadow: !showFront ? 'inset 1.5px 1.5px 0px #5B9BD5, inset -1.5px -1.5px 0px #0831a4, 1.5px 1.5px 2px rgba(0,0,0,0.3)' : '1px 1px 1px rgba(0,0,0,0.2)'
                  }}
                >
                  {/* Card back graphic representation when hidden */}
                  {!showFront && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-[10px] text-white/50 font-bold select-none p-1 pointer-events-none">
                      <span className="text-[12px] opacity-75">🃏</span>
                      <span className="text-[7px] tracking-wide leading-none opacity-40">SOLITAIRE</span>
                    </div>
                  )}

                  {/* Card front icon */}
                  {showFront && (
                    <span className="select-none transform rotate-0" style={{ backfaceVisibility: 'hidden' }}>
                      {card.icon}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Win / Complete screen overlay inside cards grid */}
          {isGameWon && (
            <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center text-white p-4">
              <span className="text-green-400 font-bold text-[13px] mb-1">MATCH COMPLETE!</span>
              <span className="text-gray-300 text-[10px] mb-4">Total flips: {moves}</span>
              <button
                onClick={initGame}
                className="xp-btn-classic px-5 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Play Again
              </button>
            </div>
          )}

          {/* Welcome Screen overlay */}
          {!isPlaying && !isGameWon && (
            <div className="absolute inset-0 bg-black/85 flex flex-col justify-center items-center text-white text-center p-4">
              <span className="text-blue-300 font-bold text-[12px] mb-1.5 select-none">CARDS MEMORY MATCH</span>
              <p className="text-[9.5px] text-gray-400 leading-tight mb-4">
                Flip the cards to match pairs of iconic<br />
                Windows XP system icons.<br />
                Try to clear the grid in fewer flips!
              </p>
              <button
                onClick={initGame}
                className="xp-btn-classic px-5 py-1.5 font-bold text-black cursor-pointer shadow-xs"
              >
                Deal Cards
              </button>
            </div>
          )}
        </div>

        {/* Buttons and actions */}
        <div className="flex space-x-2">
          {isPlaying && (
            <button
              onClick={initGame}
              className="xp-btn-classic px-4 py-1.5 font-bold border border-[#707070] bg-[#ECE9D8] hover:bg-[#E2DFD3] active:bg-[#C0BCAE] rounded shadow-xs cursor-pointer text-black"
            >
              Reset Game
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
