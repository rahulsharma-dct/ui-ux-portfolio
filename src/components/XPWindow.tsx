import React, { useState, useRef, useEffect } from 'react';

interface XPWindowProps {
  id: string;
  title: string;
  icon: string | React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  isActive: boolean;
  onFocus: () => void;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  zIndex?: number;
  children: React.ReactNode;
}

export const XPWindow: React.FC<XPWindowProps> = ({
  title,
  icon,
  onClose,
  onMinimize,
  isActive,
  onFocus,
  initialX = 100,
  initialY = 100,
  initialWidth = 600,
  initialHeight = 450,
  minWidth = 300,
  minHeight = 200,
  zIndex,
  children
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size to handle auto-maximize on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const windowRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const sizeStart = useRef({ width: 0, height: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  // Center window on mount based on window sizes
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const x = Math.max(20, Math.floor((w - initialWidth) / 2) + (Math.random() * 40 - 20));
    const y = Math.max(20, Math.floor((h - 50 - initialHeight) / 2) + (Math.random() * 40 - 20));
    setPosition({ x, y });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    if (isMaximized || isMobile) return;

    // Only drag from titlebar
    const target = e.target as HTMLElement;
    if (target.closest('.titlebar-drag-zone')) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      posStart.current = { ...position };
      e.preventDefault();
    }
  };

  const handleResizeMouseDown = (direction: string, e: React.MouseEvent) => {
    onFocus();
    if (isMaximized || isMobile) return;
    setIsResizing(true);
    setResizeDirection(direction);
    dragStart.current = { x: e.clientX, y: e.clientY };
    sizeStart.current = { ...size };
    posStart.current = { ...position };
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMobile) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setPosition({
          x: Math.max(0, posStart.current.x + dx),
          y: Math.max(0, posStart.current.y + dy)
        });
      }

      if (isResizing && resizeDirection && !isMobile) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;

        let newWidth = sizeStart.current.width;
        let newHeight = sizeStart.current.height;
        let newX = posStart.current.x;
        let newY = posStart.current.y;

        if (resizeDirection.includes('e')) {
          newWidth = Math.max(minWidth, sizeStart.current.width + dx);
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(minHeight, sizeStart.current.height + dy);
        }
        if (resizeDirection.includes('w')) {
          const potentialWidth = sizeStart.current.width - dx;
          if (potentialWidth >= minWidth) {
            newWidth = potentialWidth;
            newX = posStart.current.x + dx;
          }
        }
        if (resizeDirection.includes('n')) {
          const potentialHeight = sizeStart.current.height - dy;
          if (potentialHeight >= minHeight) {
            newHeight = potentialHeight;
            newY = posStart.current.y + dy;
          }
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeDirection, isMobile]);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenu(null);
    };
    if (activeMenu) {
      window.addEventListener('click', handleGlobalClick);
    }
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [activeMenu]);

  const toggleMaximize = () => {
    if (isMobile) return;
    setIsMaximized(!isMaximized);
  };

  const menus: Record<string, { label: string; action?: () => void }[]> = {
    File: [
      { label: 'New', action: () => alert('New document created (mock).') },
      { label: 'Open...', action: () => alert('Opening file dialog (mock).') },
      { label: 'Save', action: () => alert('Saved successfully!') },
      { label: 'Exit', action: onClose }
    ],
    Edit: [
      { label: 'Undo', action: () => alert('Undo action (mock).') },
      { label: 'Cut', action: () => alert('Copied and removed to clipboard (mock).') },
      { label: 'Copy', action: () => alert('Copied to clipboard (mock).') },
      { label: 'Paste', action: () => alert('Pasted from clipboard (mock).') },
      { label: 'Select All', action: () => alert('All content selected.') }
    ],
    View: [
      { label: 'Status Bar', action: () => alert('Status Bar toggled.') },
      { label: 'Refresh', action: () => alert('Content refreshed.') },
      { label: isMaximized ? 'Restore' : 'Maximize', action: toggleMaximize }
    ],
    Favorites: [
      { label: 'Add to Favorites...', action: () => alert('Added to Favorites!') },
      { label: 'Organize Favorites...', action: () => alert('Opening Favorites organizer.') }
    ],
    Tools: [
      { label: 'Folder Options...', action: () => alert('Opening Folder settings.') },
      { label: 'System Properties', action: () => alert('System: Windows XP Professional') }
    ],
    Help: [
      { label: 'Help Topics', action: () => alert('Showing classic help index.') },
      { label: 'About Windows XP', action: () => alert('Windows XP Professional. Created as a custom portfolio for Jyoti Dhiman.') },
      { label: 'About Designer', action: () => alert('Jyoti Dhiman - UI/UX Designer with 1+ years experience in premium visual designs.') }
    ]
  };

  const effectivelyMaximized = isMaximized || isMobile;

  const style: React.CSSProperties = effectivelyMaximized
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: '40px', // Taskbar height
        zIndex: zIndex !== undefined ? zIndex : (isActive ? 40 : 20),
      }
    : {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: zIndex !== undefined ? zIndex : (isActive ? 40 : 20),
      };

  return (
    <div
      ref={windowRef}
      style={style}
      onMouseDown={onFocus}
      className={`xp-window flex flex-col ${isActive ? 'border-[#0055e5]' : 'border-[#7697c7] xp-window-inactive'}`}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={toggleMaximize}
        className={`titlebar-drag-zone flex items-center justify-between px-2 py-1 text-white select-none cursor-default font-bold ${
          isActive ? 'xp-titlebar-blue' : 'xp-titlebar-inactive'
        } rounded-t-[5px] h-[30px]`}
      >
        <div className="flex items-center space-x-1.5 overflow-hidden">
          {typeof icon === 'string' ? (
            <span className="text-base select-none">{icon}</span>
          ) : (
            icon
          )}
          <span className="text-[13px] truncate tracking-wide font-sans">{title}</span>
        </div>

        <div className="flex items-center space-x-1 flex-shrink-0">
          {/* Minimize Button */}
          <button
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
            onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onMinimize(); }}
            className="xp-window-btn xp-btn-min text-white text-[10px] font-bold cursor-pointer"
            title="Minimize"
          >
            <div className="w-2 h-[2px] bg-white mt-2.5"></div>
          </button>
          
          {/* Maximize Button */}
          {!isMobile && (
            <button
              onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
              onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); toggleMaximize(); }}
              className="xp-window-btn xp-btn-max text-white text-[10px] font-bold flex flex-col justify-center items-center cursor-pointer"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? (
                <div className="relative w-2.5 h-2.5">
                  <div className="absolute top-0 right-0 w-2 h-2 border border-white border-t-2"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border border-white border-t-2 bg-[#2671CA]"></div>
                </div>
              ) : (
                <div className="w-2.5 h-2 border border-white border-t-2"></div>
              )}
            </button>
          )}

          {/* Close Button */}
          <button
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
            onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onClose(); }}
            className="xp-window-btn xp-btn-close text-white text-[12px] font-bold pb-[1px] cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Menu bar / Toolbar placeholder if needed */}
      <div className="flex bg-[#ECE9D8] px-2 py-1 border-b border-[#C0C0C0] text-[11px] space-x-3 text-[#000] font-sans relative z-50">
        {Object.keys(menus).map((menuName) => (
          <div
            key={menuName}
            className="relative"
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === menuName ? null : menuName);
            }}
          >
            <span className={`cursor-pointer px-1.5 py-0.5 rounded-[2px] block ${activeMenu === menuName ? 'bg-[#316ac5] text-white' : 'hover:bg-[#316ac5] hover:text-white'}`}>
              {menuName}
            </span>
            {activeMenu === menuName && (
              <div 
                className="absolute left-0 mt-0.5 bg-[#ECE9D8] border-2 border-white border-r-[#808080] border-b-[#808080] shadow-md py-0.5 z-50 min-w-[140px] font-sans text-[11px] text-black"
                onClick={(e) => e.stopPropagation()}
              >
                {menus[menuName].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveMenu(null);
                      if (item.action) item.action();
                    }}
                    className="px-4 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer"
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-auto bg-white p-0 relative flex flex-col text-[#000]">
        {children}
      </div>

      {/* Window Resizers */}
      {!isMaximized && (
        <>
          <div
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeMouseDown('n', e)}
            className="absolute top-0 left-1 right-1 h-1 cursor-n-resize"
          />
          <div
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeMouseDown('s', e)}
            className="absolute bottom-0 left-1 right-1 h-1.5 cursor-s-resize"
          />
          <div
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeMouseDown('e', e)}
            className="absolute top-1 bottom-1 right-0 w-1.5 cursor-e-resize"
          />
          <div
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeMouseDown('w', e)}
            className="absolute top-1 bottom-1 left-0 w-1.5 cursor-w-resize"
          />
          <div
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeMouseDown('nw', e)}
            className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize"
          />
          <div
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeMouseDown('ne', e)}
            className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize"
          />
          <div
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeMouseDown('sw', e)}
            className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize"
          />
          <div
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeMouseDown('se', e)}
            className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
          />
        </>
      )}
    </div>
  );
};
