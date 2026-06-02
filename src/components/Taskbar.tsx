import React, { useState, useEffect } from 'react';

interface WindowInstance {
  id: string;
  title: string;
  icon: string | React.ReactNode;
  isMinimized: boolean;
  isActive: boolean;
}

interface TaskbarProps {
  windows: WindowInstance[];
  onStartClick: () => void;
  onWindowTabClick: (id: string) => void;
  isStartOpen: boolean;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  onStartClick,
  onWindowTabClick,
  isStartOpen
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 12 instead of 0
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      setTime(`${hours}:${minutesStr} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[40px] w-full xp-taskbar-gradient fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-[#0e3cbc] select-none text-white font-sans text-xs">
      
      {/* Start Button & Quick Launch */}
      <div className="flex items-center h-full">
        {/* Classic Green Start Button */}
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onStartClick();
          }}
          className={`h-full px-4 flex items-center space-x-1.5 xp-start-gradient rounded-r-[10px] ${
            isStartOpen ? 'brightness-90 contrast-125' : ''
          }`}
          style={{
            borderRight: '1px solid #1b5e20',
          }}
        >
          {/* Retro Windows XP logo representation */}
          <div className="flex flex-wrap w-4 h-3.5 -mt-0.5 justify-center items-center gap-[1px]">
            <div className="w-1.5 h-1.5 bg-[#f44336] rounded-tl-[1px] transform -skew-y-6"></div>
            <div className="w-1.5 h-1.5 bg-[#4caf50] rounded-tr-[1px] transform skew-y-6"></div>
            <div className="w-1.5 h-1.5 bg-[#2196f3] rounded-bl-[1px] transform skew-y-6"></div>
            <div className="w-1.5 h-1.5 bg-[#ffeb3b] rounded-br-[1px] transform -skew-y-6"></div>
          </div>
          <span className="text-[14px] font-sans font-black italic tracking-wide drop-shadow-md text-white">start</span>
        </button>

        {/* Vertical Divider */}
        <div className="w-[1.5px] h-full bg-[#1b5e20] shadow-r shadow-[#245dd7] mx-1"></div>

        {/* Quick Launch Icons */}
        <div className="hidden md:flex items-center space-x-1.5 px-2">
          <button 
            onClick={() => onWindowTabClick('projects')} 
            className="p-1 hover:bg-[#316ac5] rounded-sm transition-all" 
            title="Internet Explorer (Projects)"
          >
            🌐
          </button>
          <button 
            onClick={() => onWindowTabClick('about')} 
            className="p-1 hover:bg-[#316ac5] rounded-sm transition-all" 
            title="Notepad (About)"
          >
            📝
          </button>
          <button 
            onClick={() => onWindowTabClick('feedback')} 
            className="p-1 hover:bg-[#316ac5] rounded-sm transition-all" 
            title="Outlook Express (Contact)"
          >
            ✉️
          </button>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-[1.5px] h-full bg-[#0d3cbc] mx-1"></div>
      </div>

      {/* Running Windows Task Tabs */}
      <div className="flex-grow flex items-center px-2 space-x-1.5 overflow-x-auto h-full scrollbar-none">
        {windows.map((win: WindowInstance) => (
          <button
            key={win.id}
            onClick={() => onWindowTabClick(win.id)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-[3px] max-w-[150px] min-w-[70px] truncate border select-none transition-all ${
              win.isActive 
                ? 'bg-[#1b52b8] border-[#0c317a] shadow-[inset_1.5px_1.5px_0px_rgba(0,0,0,0.6)] font-bold text-white' 
                : 'bg-[#3b7ff6] border-[#1d52bc] hover:bg-[#4d8df8] text-[#d8e6ff]'
            }`}
          >
            <span className="text-sm flex-shrink-0">{win.icon}</span>
            <span className="text-[11px] truncate font-sans">{win.title}</span>
          </button>
        ))}
      </div>

      {/* System Tray (Clock & Status Icons) */}
      <div 
        className="flex items-center h-full px-3 py-1 space-x-2.5"
        style={{
          background: 'linear-gradient(to right, #0997ff 0%, #0050e6 15%, #0030a3 100%)',
          borderLeft: '1px solid #114ee1',
          boxShadow: 'inset 1px 1px 0px rgba(255,255,255,0.2)'
        }}
      >
        {/* Tray Icons */}
        <div className="flex items-center space-x-2">
          <span className="text-[12px] cursor-pointer" title="Network Connection Speed: 100 Mbps">⚡</span>
          <span className="text-[12px] cursor-pointer" title="Volume: High">🔊</span>
          <span className="text-[12px] cursor-pointer" title="Hardware Safely Removed">🔌</span>
        </div>
        
        {/* Digital Clock */}
        <div className="text-[11px] font-sans text-[#ffffff] font-normal cursor-default select-none pl-1">
          {time}
        </div>
      </div>
      
    </div>
  );
};
