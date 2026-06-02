import React from 'react';

interface StartMenuProps {
  onOpenApp: (appId: string) => void;
  onCloseMenu: () => void;
  isOpen: boolean;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  onOpenApp,
  onCloseMenu,
  isOpen
}) => {
  if (!isOpen) return null;

  const handleAppClick = (appId: string) => {
    onOpenApp(appId);
    onCloseMenu();
  };

  return (
    <div 
      className="absolute bottom-10 left-0 w-[430px] rounded-t-8 shadow-2xl border-4 border-[#0053eb] z-50 flex flex-col font-sans text-xs select-none"
      style={{
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        backgroundColor: '#1c7df2'
      }}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    >
      {/* Top Banner (User Profile Header) */}
      <div 
        className="flex items-center p-3 text-white font-bold text-sm"
        style={{
          background: 'linear-gradient(to right, #1153cf 0%, #1f72e7 50%, #1153cf 100%)',
          borderBottom: '1px solid #0036a6'
        }}
      >
        <div className="w-[38px] h-[38px] border-2 border-white rounded-[4px] bg-[#ECE9D8] mr-3 shadow-md flex items-center justify-center text-xl overflow-hidden">
          👩‍💻
        </div>
        <span className="text-[14px] font-sans drop-shadow-md tracking-wider">Jyoti Dhiman</span>
      </div>

      {/* Main Body (Two Columns) */}
      <div className="flex bg-white flex-grow border-b border-[#0036a6] min-h-[360px]">
        {/* Left Side: White Background, Pinned Programs */}
        <div className="w-1/2 p-1.5 flex flex-col justify-between">
          <div className="space-y-0.5">
            {/* Internet Explorer (Projects) */}
            <button
              onClick={() => handleAppClick('projects')}
              className="w-full flex items-center p-2 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-2xl mr-3">🌐</div>
              <div>
                <div className="font-bold text-[11.5px] text-[#000] group-hover:text-white">Internet Explorer</div>
                <div className="text-[10px] text-gray-500 group-hover:text-gray-200">Browse Projects</div>
              </div>
            </button>

            {/* Outlook Express (Feedback Form) */}
            <button
              onClick={() => handleAppClick('feedback')}
              className="w-full flex items-center p-2 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-2xl mr-3">✉️</div>
              <div>
                <div className="font-bold text-[11.5px] text-[#000] group-hover:text-white">Outlook Express</div>
                <div className="text-[10px] text-gray-500 group-hover:text-gray-200">Send Feedback & Contact</div>
              </div>
            </button>

            <div className="h-[1px] bg-gray-200 my-1 mx-2"></div>

            {/* Notepad (About Me) */}
            <button
              onClick={() => handleAppClick('about')}
              className="w-full flex items-center p-2 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-2xl mr-3">📝</div>
              <div>
                <div className="font-bold text-[11.5px] text-[#000] group-hover:text-white">Notepad</div>
                <div className="text-[10px] text-gray-500 group-hover:text-gray-200">About & Resume</div>
              </div>
            </button>

            {/* My Tools (Skills & Tools) */}
            <button
              onClick={() => handleAppClick('tools')}
              className="w-full flex items-center p-2 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-2xl mr-3">📂</div>
              <div>
                <div className="font-bold text-[11.5px] text-[#000] group-hover:text-white">My Tools</div>
                <div className="text-[10px] text-gray-500 group-hover:text-gray-200">Design Tools & Skills</div>
              </div>
            </button>

            {/* Minesweeper (Bonus) */}
            <button
              onClick={() => handleAppClick('minesweeper')}
              className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-xl mr-3">💣</div>
              <div>
                <div className="font-bold text-[11px] text-[#000] group-hover:text-white">Minesweeper</div>
                <div className="text-[9.5px] text-gray-500 group-hover:text-gray-200">Play Retro Minesweeper</div>
              </div>
            </button>

            {/* Paint Program */}
            <button
              onClick={() => handleAppClick('paint')}
              className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-xl mr-3">🎨</div>
              <div>
                <div className="font-bold text-[11px] text-[#000] group-hover:text-white">Paint</div>
                <div className="text-[9.5px] text-gray-500 group-hover:text-gray-200">Draw & Sketch Designs</div>
              </div>
            </button>

            {/* Tic Tac Toe Program */}
            <button
              onClick={() => handleAppClick('tictactoe')}
              className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-xl mr-3">📎</div>
              <div>
                <div className="font-bold text-[11px] text-[#000] group-hover:text-white">Tic Tac Toe</div>
                <div className="text-[9.5px] text-gray-500 group-hover:text-gray-200">Play vs Clippy AI</div>
              </div>
            </button>

            {/* Snake Program */}
            <button
              onClick={() => handleAppClick('snake')}
              className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-xl mr-3">🐍</div>
              <div>
                <div className="font-bold text-[11px] text-[#000] group-hover:text-white">XP Snake</div>
                <div className="text-[9.5px] text-gray-500 group-hover:text-gray-200">Eat Apples & Score High</div>
              </div>
            </button>

            {/* Tetris Program */}
            <button
              onClick={() => handleAppClick('tetris')}
              className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-xl mr-3">🧱</div>
              <div>
                <div className="font-bold text-[11px] text-[#000] group-hover:text-white">Block Cascade</div>
                <div className="text-[9.5px] text-gray-500 group-hover:text-gray-200">Play Retro Tetris</div>
              </div>
            </button>

            {/* Brick Breaker Program */}
            <button
              onClick={() => handleAppClick('brickbreaker')}
              className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-xl mr-3">🥎</div>
              <div>
                <div className="font-bold text-[11px] text-[#000] group-hover:text-white">Brick Breaker</div>
                <div className="text-[9.5px] text-gray-500 group-hover:text-gray-200">DX-Ball style game</div>
              </div>
            </button>

            {/* Flappy Clippy Program */}
            <button
              onClick={() => handleAppClick('flappyclippy')}
              className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-xl mr-3">🧷</div>
              <div>
                <div className="font-bold text-[11px] text-[#000] group-hover:text-white">Flappy Clippy</div>
                <div className="text-[9.5px] text-gray-500 group-hover:text-gray-200">Help Clippy fly high</div>
              </div>
            </button>

            {/* Memory Match Program */}
            <button
              onClick={() => handleAppClick('memorycards')}
              className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-xl mr-3">🃏</div>
              <div>
                <div className="font-bold text-[11px] text-[#000] group-hover:text-white">Memory Match</div>
                <div className="text-[9.5px] text-gray-500 group-hover:text-gray-200">Solitaire Memory Game</div>
              </div>
            </button>

            {/* Pong Program */}
            <button
              onClick={() => handleAppClick('pong')}
              className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-xl mr-3">🏓</div>
              <div>
                <div className="font-bold text-[11px] text-[#000] group-hover:text-white">XP Pong</div>
                <div className="text-[9.5px] text-gray-500 group-hover:text-gray-200">Classic table tennis game</div>
              </div>
            </button>

            {/* Space Defender Program */}
            <button
              onClick={() => handleAppClick('spaceinvaders')}
              className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-xl mr-3">🚀</div>
              <div>
                <div className="font-bold text-[11px] text-[#000] group-hover:text-white">Space Defender</div>
                <div className="text-[9.5px] text-gray-500 group-hover:text-gray-200">Shoot the alien invaders</div>
              </div>
            </button>

            {/* Clippy Runner Program */}
            <button
              onClick={() => handleAppClick('dinorun')}
              className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-xl mr-3">🏃</div>
              <div>
                <div className="font-bold text-[11px] text-[#000] group-hover:text-white">Clippy Runner</div>
                <div className="text-[9.5px] text-gray-500 group-hover:text-gray-200">Jump over desk obstacles</div>
              </div>
            </button>

            {/* Pacman Program */}
            <button
              onClick={() => handleAppClick('pacman')}
              className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
            >
              <div className="text-xl mr-3">🍕</div>
              <div>
                <div className="font-bold text-[11px] text-[#000] group-hover:text-white">Pacman Grid</div>
                <div className="text-[9.5px] text-gray-500 group-hover:text-gray-200">Collect dots in a maze</div>
              </div>
            </button>
          </div>

          {/* All Programs button at bottom left */}
          <div className="border-t border-gray-200 pt-1.5 mt-1.5">
            <button 
              onClick={() => handleAppClick('projects')}
              className="w-full flex items-center justify-center py-1.5 font-bold hover:bg-[#316ac5] hover:text-white rounded-[3px] text-center"
            >
              <span>All Programs</span>
              <span className="ml-2 text-[10px] text-[#228B22] font-black">▶</span>
            </button>
          </div>
        </div>

        {/* Right Side: Grey/Blue background, System Directories */}
        <div className="w-1/2 bg-[#d3e5fa] border-l border-[#b5d3f5] p-2 space-y-1">
          <button
            onClick={() => handleAppClick('about')}
            className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
          >
            <span className="text-base mr-2.5">📂</span>
            <span className="font-bold text-[#001c70] group-hover:text-white text-[11px]">My Tools</span>
          </button>

          <button
            onClick={() => handleAppClick('tools')}
            className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
          >
            <span className="text-base mr-2.5">🖼️</span>
            <span className="font-bold text-[#001c70] group-hover:text-white text-[11px]">My Pictures</span>
          </button>

          <button
            onClick={() => handleAppClick('projects')}
            className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
          >
            <span className="text-base mr-2.5">💻</span>
            <span className="font-bold text-[#001c70] group-hover:text-white text-[11px]">My Computer</span>
          </button>

          <button
            onClick={() => handleAppClick('youtube')}
            className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
          >
            <span className="text-base mr-2.5">📺</span>
            <span className="font-bold text-[#001c70] group-hover:text-white text-[11px]">Windows Media Player</span>
          </button>

          <div className="h-[1px] bg-[#b5d3f5] my-1 mx-1"></div>

          <div className="p-1 text-gray-500 font-bold text-[10px] tracking-wider">LINKS</div>

          <a
            href="https://www.linkedin.com/in/jyoti-dhiman-b5aa47269?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
          >
            <span className="text-base mr-2.5">🔗</span>
            <span className="font-bold text-[#001c70] group-hover:text-white text-[11px]">LinkedIn Profile</span>
          </a>

          <a
            href="mailto:jyotidhiman4463@gmail.com"
            className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group"
          >
            <span className="text-base mr-2.5">📧</span>
            <span className="font-bold text-[#001c70] group-hover:text-white text-[11px]">Email Jyoti</span>
          </a>

          <a
            href="https://docs.google.com/document/d/112edYCu-nw4Gi-ty_LsD83iU_76RQXPKoNnLTAHguoA/edit?tab=t.0"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center p-1.5 rounded-[3px] hover:bg-[#316ac5] hover:text-white text-left group font-sans"
          >
            <span className="text-base mr-2.5">📄</span>
            <span className="font-bold text-[#001c70] group-hover:text-white text-[11px]">Google Doc Resume</span>
          </a>
        </div>
      </div>

      {/* Bottom Tray (Log Off & Turn Off) */}
      <div 
        className="flex justify-end items-center p-2 space-x-3 select-none h-[42px]"
        style={{
          background: 'linear-gradient(to bottom, #1c7df2 0%, #0d59cf 100%)'
        }}
      >
        <button
          onClick={() => {
            alert("Logging off Jyoti's Portfolio... Just kidding! Thanks for visiting.");
            onCloseMenu();
          }}
          className="flex items-center text-white font-bold hover:underline"
        >
          <div className="w-5 h-5 bg-[#ff9800] rounded-sm mr-1.5 flex items-center justify-center text-xs shadow-sm">🔑</div>
          <span>Log Off</span>
        </button>

        <button
          onClick={() => {
            if (confirm("Are you sure you want to shut down this portfolio simulation?")) {
              document.body.innerHTML = `
                <div style="background-color: black; color: #ECE9D8; font-family: monospace; display: flex; flex-direction: column; justify-content: center; items-center: center; height: 100vh; text-align: center; padding: 20px;">
                  <h1 style="font-size: 24px; margin-bottom: 20px; color: #ff0000;">System Shutdown</h1>
                  <p style="font-size: 16px; margin-bottom: 30px;">It is now safe to turn off your computer.</p>
                  <button onclick="window.location.reload()" style="background-color: #ECE9D8; color: black; border: 2px solid #808080; padding: 8px 16px; cursor: pointer; font-family: sans-serif; font-weight: bold;">Restart Portfolio</button>
                </div>
              `;
            }
            onCloseMenu();
          }}
          className="flex items-center text-white font-bold hover:underline mr-2"
        >
          <div className="w-5 h-5 bg-[#d32f2f] rounded-sm mr-1.5 flex items-center justify-center text-[10px] shadow-sm">🔴</div>
          <span>Turn Off Computer</span>
        </button>
      </div>
    </div>
  );
};
