import React, { useState } from 'react';
import { XPWindow } from './components/XPWindow';
import { StartMenu } from './components/StartMenu';
import { Taskbar } from './components/Taskbar';
import { FeedbackForm } from './components/FeedbackForm';
import { Minesweeper } from './components/Minesweeper';
import { Paint } from './components/Paint';
import { TicTacToe } from './components/TicTacToe';
import { Snake } from './components/Snake';
import { Tetris } from './components/Tetris';
import { BrickBreaker } from './components/BrickBreaker';
import { FlappyClippy } from './components/FlappyClippy';
import { MemoryCards } from './components/MemoryCards';
import { Pong } from './components/Pong';
import { SpaceInvaders } from './components/SpaceInvaders';
import { DinoRun } from './components/DinoRun';
import { Pacman } from './components/Pacman';
import { BubbleBackground } from './components/BubbleBackground';
import { YouTubePlayer } from './components/YouTubePlayer';

interface WindowState {
  id: string;
  title: string;
  icon: string;
  isMinimized: boolean;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
}

interface Project {
  name: string;
  url?: string;
  description: string;
  category: string;
  imageIcon: string;
}

export default function App() {
  const [openWindows, setOpenWindows] = useState<WindowState[]>([
    // Open Notepad by default to welcome users
    { id: 'about', title: 'Notepad - About Jyoti', icon: '📝', isMinimized: false, initialWidth: 550, initialHeight: 400 }
  ]);
  const [activeWindowId, setActiveWindowId] = useState<string>('about');
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Custom states for wallpapers & custom desktop context menu
  const [currentWallpaper, setCurrentWallpaper] = useState('bliss');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

  // List of Projects requested
  const projects: Project[] = [
    {
      name: 'Family 1st Project',
      url: 'https://family1st.io/',
      category: 'Web App & Security UX',
      description: 'Family 1st provides family tracking and communication tools. Handled the interface design prioritizing ease-of-use, high accessibility, and neat child-tracking safety dashboards.',
      imageIcon: '👨‍👩‍👧‍👦'
    },
    {
      name: 'Kameti Ledger',
      url: 'https://kametiledger.com/',
      category: 'Fintech & Bookkeeping UI',
      description: 'A digitized bookkeeping ledger for traditional community committees (Kametis). Designed to simplify recording savings, tracking payouts, and building trust through transparent balance sheets.',
      imageIcon: '💰'
    },
    {
      name: 'Plantark',
      url: 'https://plantark.com.au/',
      category: 'E-commerce & Gardening Service',
      description: 'An Australian marketplace for plant enthusiasts. Formulated UX user flows for buying, shipping, and listing plants with interactive care calendars and localized plant filters.',
      imageIcon: '🌿'
    },
    {
      name: 'Lago Vista Development Services',
      category: 'Municipal & Building Portal',
      description: 'Streamlined application portal for building permit trackers, city zoning maps, and municipal development requests. Focused on high-density information architecture.',
      imageIcon: '🏗️'
    },
    {
      name: 'Amrita Life',
      url: 'https://amritalife.com/',
      category: 'Healthcare & Wellness Store',
      description: 'An online Ayurvedic health store. Designed the customer-first wellness questionnaire that recommends custom oils/supplements, raising storefront conversions by 28%.',
      imageIcon: '🧘'
    },
    {
      name: 'Luxury Fit',
      category: 'E-commerce (Premium Fashion)',
      description: 'A premium apparel shop with a minimalist shopping basket, custom sizing engine, and 3D clothing visualizers. Designed the sleek checkout flow.',
      imageIcon: '🧥'
    },
    {
      name: 'Ranger FX',
      url: 'https://www.rangersfx.com/',
      category: 'Forex Trading Platform',
      description: 'Designed trading dashboards, live currency rate charts, and margin calculator overlays. Maintained high performance layout rules for real-time charting systems.',
      imageIcon: '📈'
    },
    {
      name: 'MMCI Coaching Institute',
      url: 'https://mmcilearning.in/',
      category: 'Ed-Tech & Learning Portal',
      description: 'An online test-prep coaching dashboard. Integrated test timers, score matrices, and progress bar maps for competitive exam candidates.',
      imageIcon: '🎓'
    },
    {
      name: 'DCT Technology',
      url: 'https://dctinfotech.com/',
      category: 'IT Consultancy & Enterprise Solutions',
      description: 'Corporate B2B presentation site for IT infrastructure and software architecture firm. Emphasized clear grid-based services layout and quick project estimate forms.',
      imageIcon: '🛡️'
    },
    {
      name: 'CRMS',
      category: 'SaaS CRM System',
      description: 'An internal Customer Relationship Management tool. Includes lead scoring boards, automated pipeline milestones, and calendar planner overlays for sales representatives.',
      imageIcon: '📊'
    }
  ];

  const tools = [
    { name: 'Figma', desc: 'Interface Design & Prototyping', icon: '🎨' },
    { name: 'Framer', desc: 'Interactive High-Fidelity Mockups', icon: '⚡' },
    { name: 'Canva', desc: 'Social Assets & Visual Layouts', icon: '🖌️' },
    { name: 'Claude', desc: 'AI Coding Partner & Copywriting', icon: '🤖' },
    { name: 'Photoshop', desc: 'Raster Image Editing & Graphics', icon: '📷' },
    { name: 'Notion', desc: 'Knowledge Base & Workspace Wiki', icon: '📓' }
  ];

  const handleOpenApp = (id: string, customProps?: Partial<WindowState>) => {
    const defaultApps: Record<string, Partial<WindowState>> = {
      about: { title: 'Notepad - About Jyoti', icon: '📝', initialWidth: 550, initialHeight: 400 },
      projects: { title: 'My Computer - Projects', icon: '💻', initialWidth: 620, initialHeight: 450 },
      tools: { title: 'My Documents - Tools & Skills', icon: '📂', initialWidth: 500, initialHeight: 380 },
      feedback: { title: 'Outlook Express - Send Feedback', icon: '✉️', initialWidth: 580, initialHeight: 480 },
      minesweeper: { title: 'Minesweeper', icon: '💣', initialWidth: 280, initialHeight: 340 },
      paint: { title: 'untitled - Paint', icon: '🎨', initialWidth: 650, initialHeight: 480 },
      tictactoe: { title: "Clippy's Challenge - Tic Tac Toe", icon: '📎', initialWidth: 430, initialHeight: 360 },
      snake: { title: 'XP Snake Arcade', icon: '🐍', initialWidth: 440, initialHeight: 350 },
      tetris: { title: 'Block Cascade', icon: '🧱', initialWidth: 290, initialHeight: 390 },
      brickbreaker: { title: 'XP Brick Breaker', icon: '🥎', initialWidth: 350, initialHeight: 350 },
      flappyclippy: { title: 'Flappy Clippy', icon: '🧷', initialWidth: 350, initialHeight: 350 },
      memorycards: { title: 'Solitaire Memory Match', icon: '🃏', initialWidth: 290, initialHeight: 390 },
      pong: { title: 'XP Pong Table', icon: '🏓', initialWidth: 350, initialHeight: 320 },
      spaceinvaders: { title: 'XP Space Defender', icon: '🚀', initialWidth: 350, initialHeight: 320 },
      dinorun: { title: 'Clippy Runner (Dino)', icon: '🏃', initialWidth: 350, initialHeight: 300 },
      pacman: { title: 'Pacman Grid Arcade', icon: '🍕', initialWidth: 300, initialHeight: 360 },
      youtube: { title: 'Windows Media Player', icon: '📺', initialWidth: 680, initialHeight: 480 },
      wallpaper: { title: 'Display Properties', icon: '🖼️', initialWidth: 420, initialHeight: 385 }
    };

    const exists = openWindows.find((w: WindowState) => w.id === id);
    if (exists) {
      // If minimized, restore it
      if (exists.isMinimized) {
        setOpenWindows(openWindows.map((w: WindowState) => w.id === id ? { ...w, isMinimized: false } : w));
      }
      setActiveWindowId(id);
    } else {
      const appMeta = { ...defaultApps[id], ...customProps };
      setOpenWindows([...openWindows, {
        id,
        title: appMeta.title || 'Application',
        icon: appMeta.icon || '⚙️',
        isMinimized: false,
        initialWidth: appMeta.initialWidth,
        initialHeight: appMeta.initialHeight
      }]);
      setActiveWindowId(id);
    }
  };

  const handleCloseApp = (id: string) => {
    setOpenWindows(openWindows.filter((w: WindowState) => w.id !== id));
    if (activeWindowId === id) {
      const remaining = openWindows.filter((w: WindowState) => w.id !== id && !w.isMinimized);
      if (remaining.length > 0) {
        setActiveWindowId(remaining[remaining.length - 1].id);
      }
    }
  };

  const handleMinimizeApp = (id: string) => {
    setOpenWindows(openWindows.map((w: WindowState) => w.id === id ? { ...w, isMinimized: true } : w));
    // Find next active window
    const remaining = openWindows.filter((w: WindowState) => w.id !== id && !w.isMinimized);
    if (remaining.length > 0) {
      setActiveWindowId(remaining[remaining.length - 1].id);
    } else {
      setActiveWindowId('');
    }
  };

  const handleTaskbarTabClick = (id: string) => {
    const target = openWindows.find((w: WindowState) => w.id === id);
    if (!target) {
      handleOpenApp(id);
      return;
    }

    if (target.isMinimized) {
      setOpenWindows(openWindows.map((w: WindowState) => w.id === id ? { ...w, isMinimized: false } : w));
      setActiveWindowId(id);
    } else if (activeWindowId === id) {
      handleMinimizeApp(id);
    } else {
      setActiveWindowId(id);
    }
  };

  const desktopIcons = [
    { id: 'projects', label: 'My Computer', icon: '💻' },
    { id: 'tools', label: 'My Documents', icon: '📂' },
    { id: 'about', label: 'Notepad', icon: '📝' },
    { id: 'feedback', label: 'Outlook Express', icon: '✉️' },
    { id: 'paint', label: 'Paint', icon: '🎨' },
    { id: 'minesweeper', label: 'Minesweeper', icon: '💣' },
    { id: 'tictactoe', label: 'Tic Tac Toe', icon: '📎' },
    { id: 'snake', label: 'XP Snake', icon: '🐍' },
    { id: 'tetris', label: 'Block Cascade', icon: '🧱' },
    { id: 'brickbreaker', label: 'Brick Breaker', icon: '🥎' },
    { id: 'flappyclippy', label: 'Flappy Clippy', icon: '🧷' },
    { id: 'memorycards', label: 'Memory Match', icon: '🃏' },
    { id: 'pong', label: 'XP Pong', icon: '🏓' },
    { id: 'spaceinvaders', label: 'Space Defender', icon: '🚀' },
    { id: 'dinorun', label: 'Clippy Runner', icon: '🏃' },
    { id: 'pacman', label: 'Pacman Grid', icon: '🍕' },
    { id: 'youtube', label: 'Media Player', icon: '📺' },
    { 
      id: 'recycle-bin', 
      label: 'Recycle Bin', 
      icon: '🗑️',
      action: () => alert("Recycle Bin is empty! (Your old layout bugs have been permanently deleted!)")
    }
  ];

  const wallpapers: Record<string, string> = {
    bliss: '/bliss.jpg',
    autumn: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop',
    space: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1920&auto=format&fit=crop',
    teal: ''
  };

  const getBackgroundStyle = () => {
    const url = wallpapers[currentWallpaper];
    if (url) {
      return {
        backgroundImage: `url('${url}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom center'
      };
    }
    return {
      backgroundColor: '#008080'
    };
  };

  return (
    <div 
      className="h-screen w-screen relative select-none font-sans overflow-hidden"
      style={getBackgroundStyle()}
      onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
      }}
      onClick={() => {
        setIsStartOpen(false);
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }}
    >
      {/* Dynamic Soap Bubbles Background Screensaver */}
      <BubbleBackground />

      {/* Desktop Grid Layout */}
      <div className="absolute inset-0 p-4 flex flex-col flex-wrap gap-4 content-start select-none pb-[50px] z-10">
        {desktopIcons.map((di) => (
          <div
            key={di.id}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              di.action ? di.action() : handleOpenApp(di.id);
            }}
            className="flex flex-col items-center justify-center p-2 rounded cursor-pointer hover:bg-white/15 w-[85px] text-center transition-all group"
          >
            <div className="text-[34px] drop-shadow-md select-none group-hover:scale-105 transition-transform">
              {di.icon}
            </div>
            <span className="text-white text-[11.5px] mt-1 select-none font-sans drop-shadow-md font-semibold tracking-wide bg-black/35 px-1 py-0.5 rounded-sm truncate w-full">
              {di.label}
            </span>
          </div>
        ))}
      </div>

      {/* Windows Layer */}
      {openWindows.map((win: WindowState) => {
        if (win.isMinimized) return null;

        return (
          <XPWindow
            key={win.id}
            id={win.id}
            title={win.title}
            icon={win.icon}
            isActive={activeWindowId === win.id}
            onClose={() => handleCloseApp(win.id)}
            onMinimize={() => handleMinimizeApp(win.id)}
            onFocus={() => setActiveWindowId(win.id)}
            initialWidth={win.initialWidth}
            initialHeight={win.initialHeight}
          >
            {/* Notepad / About Application */}
            {win.id === 'about' && (
              <div className="flex-grow flex flex-col h-full bg-[#FFFFFA] text-black">
                {/* Clean, authentic lined paper writing sheet */}
                <div className="flex-grow p-5 overflow-auto lined-paper font-mono text-[12.5px] leading-[22px]">
                  <div className="max-w-2xl mx-auto space-y-4">
                    <h1 className="text-base font-bold font-sans text-xp-blue-dark border-b border-gray-200 pb-1 mb-2">
                      welcome_note.txt - Notepad
                    </h1>
                    <div>
                      <span className="font-bold text-gray-800 font-sans">Name:</span> <span className="font-sans font-semibold text-gray-900">Jyoti Dhiman</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-800 font-sans">Role:</span> <span className="font-sans text-gray-700">UX/UI Designer (1+ years in Visual Design)</span>
                    </div>
                    
                    <div className="bg-[#FFFFE1]/90 border-l-4 border-yellow-400 p-3 my-2 font-sans italic text-gray-800 shadow-xs rounded-r">
                      "I create accessible, easy-to-use interfaces with clean visuals and an understanding of front-end development."
                    </div>
                    
                    <p className="font-sans text-gray-800 leading-relaxed text-[12px]">
                      My focus is on clear layouts, smooth interactions, and user-friendly digital experiences that not only look visually appealing but also solve real problems through continuous improvement and user feedback.
                    </p>
                  </div>
                </div>

                {/* File Details & Action Tray */}
                <div className="bg-[#ECE9D8] px-4 py-2 border-t border-[#C0C0C0] flex items-center justify-between font-sans text-xs">
                  <span className="text-[10px] text-gray-600">Ln 12, Col 43 | UTF-8</span>
                  <a
                    href="https://docs.google.com/document/d/112edYCu-nw4Gi-ty_LsD83iU_76RQXPKoNnLTAHguoA/edit?tab=t.0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="xp-btn-classic px-4 py-1.5 font-bold flex items-center space-x-1.5 rounded active:scale-[0.98] transition-transform text-[#000]"
                  >
                    <span>📥 Download Resume.doc</span>
                  </a>
                </div>
              </div>
            )}

            {/* My Computer / Projects Application */}
            {win.id === 'projects' && (
              <div className="flex-grow bg-white flex flex-col h-full overflow-hidden text-xs">
                {/* Explorer Address Bar */}
                <div className="bg-[#ECE9D8] px-2 py-1.5 border-b border-[#CCCCCC] flex items-center space-x-1.5 font-sans">
                  <span className="text-gray-500 font-semibold select-none">Address:</span>
                  <div className="flex-grow bg-white border border-[#7F9DB9] px-2 py-0.5 text-[11px] truncate flex items-center text-gray-600">
                    💻 My Computer\Jyoti_Projects\
                  </div>
                </div>

                {/* Main panel - grid of project folders or detail view */}
                <div className="flex-grow flex overflow-hidden">
                  {/* Left explorer sidebar */}
                  <div className="w-[185px] bg-[#7E9EC2]/20 border-r border-[#A0A0A0] p-2.5 hidden sm:flex flex-col space-y-3 font-sans select-none">
                    {/* Common Tasks Panel */}
                    <div className="border border-[#759BC6] rounded-[3px] bg-white overflow-hidden shadow-xs">
                      <div className="xp-titlebar-blue px-2 py-1 text-white font-bold text-[11px] flex justify-between items-center">
                        <span>Folder Tasks</span>
                        <span>▼</span>
                      </div>
                      <div className="p-2 space-y-2 text-[10.5px]">
                        <div className="cursor-pointer hover:underline text-[#002C91] flex items-center space-x-1" onClick={() => setSelectedProject(null)}>
                          <span>📁</span> <span className="font-semibold">All Projects</span>
                        </div>
                        <div className="cursor-pointer hover:underline text-[#002C91] flex items-center space-x-1" onClick={() => handleOpenApp('feedback')}>
                          <span>✉️</span> <span className="font-semibold">Contact Designer</span>
                        </div>
                      </div>
                    </div>

                    {/* Other Places Panel */}
                    <div className="border border-[#759BC6] rounded-[3px] bg-white overflow-hidden shadow-xs">
                      <div className="xp-titlebar-blue px-2 py-1 text-white font-bold text-[11px] flex justify-between items-center">
                        <span>Other Places</span>
                        <span>▼</span>
                      </div>
                      <div className="p-2 space-y-2 text-[10.5px]">
                        <div className="cursor-pointer hover:underline text-[#002C91] flex items-center space-x-1" onClick={() => handleOpenApp('tools')}>
                          <span>📂</span> <span>My Documents</span>
                        </div>
                        <div className="cursor-pointer hover:underline text-[#002C91] flex items-center space-x-1" onClick={() => handleOpenApp('about')}>
                          <span>📝</span> <span>About Notepad</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Folder Contents */}
                  <div className="flex-grow p-4 overflow-auto bg-white">
                    {selectedProject ? (
                      /* Detail Project View */
                      <div className="font-sans space-y-4">
                        <button 
                          onClick={() => setSelectedProject(null)} 
                          className="xp-btn-classic px-3 py-1 font-bold rounded flex items-center space-x-1 mb-2 text-[#000]"
                        >
                          <span>◀ Back to Folders</span>
                        </button>
                        
                        <div className="flex items-center space-x-2 border-b border-gray-150 pb-2">
                          <span className="text-3xl">{selectedProject.imageIcon}</span>
                          <div>
                            <h2 className="text-[14px] font-black text-xp-blue-dark">{selectedProject.name}</h2>
                            <p className="text-[10px] text-gray-500 font-semibold">{selectedProject.category}</p>
                          </div>
                        </div>

                        <p className="text-gray-800 text-[11.5px] leading-relaxed border border-gray-200 p-3 bg-gray-50/50 rounded-[3px]">
                          {selectedProject.description}
                        </p>

                        {selectedProject.url ? (
                          <div className="pt-2">
                            <a
                              href={selectedProject.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="xp-btn-classic px-5 py-2 font-bold inline-flex items-center space-x-2 rounded text-[#000]"
                            >
                              <span>🌐 Visit Live Website</span>
                              <span className="text-[10px]">↗</span>
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[11px] block mt-1">
                            ℹ️ Private portal / Live demonstration link offline
                          </span>
                        )}
                      </div>
                    ) : (
                      /* Organized Folder Categories */
                      <div className="space-y-6">
                        {/* Live Portals Category */}
                        <div>
                          <h3 className="font-sans font-bold text-[11.5px] text-[#003C95] border-b border-gray-200 pb-1 mb-3 flex items-center space-x-1">
                            <span>🌐</span> <span>Live Web Portals</span>
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {projects.filter(p => p.url).map((proj) => (
                              <div
                                key={proj.name}
                                onClick={() => setSelectedProject(proj)}
                                className="flex items-center p-2 border border-gray-100 hover:border-[#316ac5]/20 hover:bg-[#316ac5]/5 rounded-[3px] cursor-pointer group transition-colors space-x-2"
                              >
                                <span className="text-2xl select-none">📁</span>
                                <span className="font-sans font-semibold text-[11px] text-gray-800 group-hover:text-[#002c91] truncate flex-grow">
                                  {proj.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Concept Prototypes Category */}
                        <div>
                          <h3 className="font-sans font-bold text-[11.5px] text-[#003C95] border-b border-gray-200 pb-1 mb-3 flex items-center space-x-1">
                            <span>🛠️</span> <span>Case Studies & Product Concepts</span>
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {projects.filter(p => !p.url).map((proj) => (
                              <div
                                key={proj.name}
                                onClick={() => setSelectedProject(proj)}
                                className="flex items-center p-2 border border-gray-100 hover:border-[#316ac5]/20 hover:bg-[#316ac5]/5 rounded-[3px] cursor-pointer group transition-colors space-x-2"
                              >
                                <span className="text-2xl select-none">📁</span>
                                <span className="font-sans font-semibold text-[11px] text-gray-800 group-hover:text-[#002c91] truncate flex-grow">
                                  {proj.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* My Documents / Tools Application */}
            {win.id === 'tools' && (
              <div className="flex-grow bg-[#F1F0E8] p-4 overflow-auto font-sans text-xs">
                <div className="mb-4">
                  <h2 className="text-[14px] font-black text-[#001c70] border-b border-[#CCCCCC] pb-1.5 mb-2">
                    🛠️ Design Tools & Skills Box
                  </h2>
                  <p className="text-gray-600 mb-3">
                    Here are the primary tools I use to map interfaces, design mockups, and build visual prototypes:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tools.map((tool) => (
                    <div 
                      key={tool.name} 
                      className="bg-white border border-[#D3D3D3] p-3 rounded flex items-center space-x-3 shadow-xs hover:border-[#245DDA] transition-colors"
                    >
                      <span className="text-2xl select-none">{tool.icon}</span>
                      <div>
                        <div className="font-bold text-gray-800 text-[12px]">{tool.name}</div>
                        <div className="text-gray-500 text-[10.5px]">{tool.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outlook Express / Feedback Application */}
            {win.id === 'feedback' && (
              <FeedbackForm />
            )}

            {/* Minesweeper Application */}
            {win.id === 'minesweeper' && (
              <Minesweeper />
            )}

            {/* Paint Application */}
            {win.id === 'paint' && (
              <Paint />
            )}

            {/* Tic Tac Toe Application */}
            {win.id === 'tictactoe' && (
              <TicTacToe />
            )}

            {/* Snake Application */}
            {win.id === 'snake' && (
              <Snake />
            )}

            {/* Tetris Application */}
            {win.id === 'tetris' && (
              <Tetris />
            )}

            {/* Brick Breaker Application */}
            {win.id === 'brickbreaker' && (
              <BrickBreaker />
            )}

            {/* Flappy Clippy Application */}
            {win.id === 'flappyclippy' && (
              <FlappyClippy />
            )}

            {/* Memory Cards Application */}
            {win.id === 'memorycards' && (
              <MemoryCards />
            )}

            {/* Pong Application */}
            {win.id === 'pong' && (
              <Pong />
            )}

            {/* Space Invaders Application */}
            {win.id === 'spaceinvaders' && (
              <SpaceInvaders />
            )}

            {/* Dino Run Application */}
            {win.id === 'dinorun' && (
              <DinoRun />
            )}

            {/* Pacman Application */}
            {win.id === 'pacman' && (
              <Pacman />
            )}

            {/* Windows Media Player / YouTube */}
            {win.id === 'youtube' && (
              <YouTubePlayer />
            )}

            {/* Display Settings Wallpaper Changer */}
            {win.id === 'wallpaper' && (
              <div className="flex-grow bg-[#ECE9D8] p-4 flex flex-col justify-between font-sans text-xs">
                <div>
                  <h3 className="font-bold text-[#001c70] border-b border-gray-300 pb-2 mb-3">Desktop Wallpaper Select</h3>
                  <div className="space-y-3 bg-white p-3 border border-[#808080] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.1)] rounded">
                    {[
                      { id: 'bliss', label: 'Bliss (Default Landscape)' },
                      { id: 'autumn', label: 'Autumn Forest' },
                      { id: 'space', label: 'Mystic Space' },
                      { id: 'teal', label: 'Windows Classic Teal (Solid)' }
                    ].map((wp) => (
                      <label key={wp.id} className="flex items-center space-x-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="wallpaper-opt"
                          checked={currentWallpaper === wp.id}
                          onChange={() => setCurrentWallpaper(wp.id)}
                          className="cursor-pointer"
                        />
                        <span className="font-sans font-semibold text-gray-800">{wp.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-300 mt-4">
                  <button 
                    onClick={() => handleCloseApp('wallpaper')} 
                    className="xp-btn-classic px-4 py-1.5 font-bold rounded text-black cursor-pointer"
                  >
                    OK
                  </button>
                  <button 
                    onClick={() => handleCloseApp('wallpaper')} 
                    className="xp-btn-classic px-4 py-1.5 font-bold rounded text-black cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </XPWindow>
        );
      })}

      {/* Start Menu Overlay */}
      <StartMenu
        isOpen={isStartOpen}
        onOpenApp={handleOpenApp}
        onCloseMenu={() => setIsStartOpen(false)}
      />

      {/* Right Click Desktop Context Menu */}
      {contextMenu.visible && (
        <div
          className="absolute bg-[#ECE9D8] border border-[#808080] shadow-md z-50 py-1 font-sans text-xs w-[150px] select-none text-black"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            boxShadow: '2px 2px 3px rgba(0,0,0,0.3), inset 1px 1px 0px #fff'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            onClick={() => { window.location.reload(); }}
            className="px-4 py-1.5 hover:bg-[#316ac5] hover:text-white cursor-pointer select-none text-left"
          >
            🔄 Refresh
          </div>
          <div className="h-[1px] bg-gray-300 my-1"></div>
          <div 
            onClick={() => { handleOpenApp('wallpaper'); setContextMenu(prev => ({ ...prev, visible: false })); }}
            className="px-4 py-1.5 hover:bg-[#316ac5] hover:text-white cursor-pointer select-none text-left"
          >
            🖼️ Change Wallpaper...
          </div>
          <div 
            onClick={() => { handleOpenApp('wallpaper'); setContextMenu(prev => ({ ...prev, visible: false })); }}
            className="px-4 py-1.5 hover:bg-[#316ac5] hover:text-white cursor-pointer select-none text-left"
          >
            🛠️ Properties
          </div>
        </div>
      )}
      
      {/* Taskbar at Bottom */}
      <Taskbar
        isStartOpen={isStartOpen}
        onStartClick={() => setIsStartOpen(!isStartOpen)}
        onWindowTabClick={handleTaskbarTabClick}
        windows={openWindows.map((win: WindowState) => ({
          id: win.id,
          title: win.title,
          icon: win.icon,
          isMinimized: win.isMinimized,
          isActive: activeWindowId === win.id
        }))}
      />
    </div>
  );
}
