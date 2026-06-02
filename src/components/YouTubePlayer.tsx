import React, { useState } from 'react';

interface PlaylistItem {
  title: string;
  id: string;
  duration: string;
  category: string;
}

export const YouTubePlayer: React.FC = () => {
  const playlist: PlaylistItem[] = [
    { title: 'Lofi Hip Hop Radio 📚 (Study/Relax)', id: 'jfKfPfyJRdk', duration: 'LIVE', category: 'Productivity' },
    { title: 'Windows XP Soundtracks & Relaxing Ambient', id: 'fVj4q1B2H-Y', duration: '24:15', category: 'Nostalgia' },
    { title: 'Retro Synthwave Radio 🌌 (80s Beats)', id: '4xDzrJKXOOY', duration: 'LIVE', category: 'Synthwave' },
    { title: 'Classic Windows Startup Sound Compilation', id: '2mD40578Hls', duration: '8:42', category: 'Nostalgia' },
    { title: 'Rick Astley - Never Gonna Give You Up', id: 'dQw4w9WgXcQ', duration: '3:32', category: 'Classic' }
  ];

  const [currentVideoId, setCurrentVideoId] = useState<string>('jfKfPfyJRdk');
  const [urlInput, setUrlInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const getYouTubeId = (url: string): string | null => {
    // Standard YT link: https://www.youtube.com/watch?v=video_id
    // Mobile YT link: https://youtu.be/video_id
    // Embed link: https://www.youtube.com/embed/video_id
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    // Check if it's already a direct 11-char ID
    if (url.trim().length === 11) {
      return url.trim();
    }
    return null;
  };

  const handlePlayUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const videoId = getYouTubeId(urlInput);
    if (videoId) {
      setCurrentVideoId(videoId);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid YouTube URL or Video ID. Please try again!');
    }
  };

  const currentPlaying = playlist.find(v => v.id === currentVideoId) || {
    title: 'Custom User Video Stream',
    duration: 'Unknown',
    category: 'Custom'
  };

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] text-black font-sans text-xs select-none">
      {/* Menu / Address Bar (Styled like WMP Toolbar / Browser URL bar) */}
      <div className="bg-[#ECE9D8] px-3 py-2 border-b border-[#C0C0C0] flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3">
        <span className="font-bold text-gray-700 whitespace-nowrap">🎥 Quick Load:</span>
        <form onSubmit={handlePlayUrl} className="flex-grow flex items-center space-x-1.5">
          <input
            type="text"
            placeholder="Paste YouTube Link or Video ID (e.g., dQw4w9WgXcQ)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-grow bg-white border border-[#7F9DB9] px-2 py-1 text-[11px] outline-none shadow-[inset_1px_1px_1px_rgba(0,0,0,0.1)] text-black"
          />
          <button
            type="submit"
            className="xp-btn-classic px-4 py-1 font-bold rounded active:scale-[0.98] transition-transform text-black whitespace-nowrap"
          >
            Go / Play
          </button>
        </form>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border-b border-red-300 text-red-700 px-3 py-1 font-semibold text-[10px]">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Main Player Area */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden bg-[#000] relative">
        {/* Left Side: Video Viewport */}
        <div className="flex-grow h-2/3 md:h-full relative bg-black flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-800">
          <iframe
            src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
            title="Windows XP Media Player YouTube Stream"
            className="absolute inset-0 w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Right Side: Playlist / Control Console */}
        <div className="w-full md:w-[240px] h-1/3 md:h-full bg-[#E1DFD2] flex flex-col border-t md:border-t-0 border-[#C0C0C0]">
          {/* Now Playing Panel */}
          <div className="p-3 bg-gradient-to-r from-[#245dd7] to-[#0e3cbc] text-white select-none">
            <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Now Playing</div>
            <div className="font-bold text-[11.5px] truncate mt-0.5" title={currentPlaying.title}>
              {currentPlaying.title}
            </div>
            <div className="text-[9px] mt-1 flex justify-between text-blue-100 font-semibold">
              <span>Category: {currentPlaying.category}</span>
              <span>Length: {currentPlaying.duration}</span>
            </div>
          </div>

          {/* Playlist Title */}
          <div className="bg-[#D4D0C8] border-b border-[#A0A0A0] px-3 py-1.5 font-bold text-gray-700 text-[10px] tracking-wide flex justify-between items-center shadow-xs">
            <span>XP MULTIMEDIA PLAYLIST</span>
            <span>({playlist.length} Items)</span>
          </div>

          {/* Playlist Scrollable Items */}
          <div className="flex-grow overflow-y-auto bg-white p-1">
            {playlist.map((item, idx) => {
              const isSelected = item.id === currentVideoId;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setCurrentVideoId(item.id);
                    setUrlInput('');
                    setErrorMessage('');
                  }}
                  className={`flex items-center justify-between p-2 rounded-[2px] cursor-pointer mb-1 border transition-colors ${
                    isSelected
                      ? 'bg-[#316ac5] text-white border-[#316ac5]'
                      : 'hover:bg-[#EAEAEA] border-transparent text-gray-800'
                  }`}
                >
                  <div className="flex flex-col truncate pr-1">
                    <span className="font-bold text-[11px] truncate">
                      {idx + 1}. {item.title}
                    </span>
                    <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                      {item.category}
                    </span>
                  </div>
                  <span className="text-[9.5px] font-bold opacity-80 whitespace-nowrap ml-1">
                    {item.duration}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer controls note */}
          <div className="bg-[#D4D0C8] border-t border-[#C0C0C0] p-2 text-center text-gray-500 font-semibold text-[9.5px]">
            ℹ️ Watch standard or paste custom links.
          </div>
        </div>
      </div>
    </div>
  );
};
