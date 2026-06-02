import React, { useRef, useState, useEffect } from 'react';

export const Paint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'brush'>('pencil');
  const [brushSize, setBrushSize] = useState(3);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas internal size equal to client size
    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = canvas.parentElement?.clientHeight || 300;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;

    // Fill white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      contextRef.current.lineWidth = tool === 'eraser' ? brushSize * 4 : brushSize;
    }
  }, [color, tool, brushSize]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    contextRef.current?.beginPath();
    contextRef.current?.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    contextRef.current?.lineTo(x, y);
    contextRef.current?.stroke();
  };

  const stopDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const colors = [
    '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040',
    '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff80', '#00ff80'
  ];

  return (
    <div className="flex flex-col h-full bg-[#D8D4C8] font-sans text-xs select-none">
      {/* Top Menu Bar */}
      <div className="flex bg-[#ECE9D8] px-2 py-0.5 border-b border-[#C0C0C0] text-[11px] space-x-3 text-[#000] font-sans">
        <span className="cursor-pointer hover:bg-[#316ac5] hover:text-white px-1" onClick={clearCanvas}>Clear Image</span>
      </div>

      {/* Paint Tools & Canvas Panel */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Left Toolbar (Tools) */}
        <div className="w-[50px] bg-[#ECE9D8] border-r border-[#C0C0C0] p-1 flex flex-col items-center space-y-1.5 shadow-inner">
          <button 
            onClick={() => setTool('pencil')}
            className={`w-8 h-8 flex items-center justify-center border text-lg rounded-[2px] ${
              tool === 'pencil' ? 'bg-[#D3E5FA] border-[#7F9DB9] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.2)]' : 'xp-btn-classic'
            }`}
            title="Pencil"
          >
            ✏️
          </button>
          <button 
            onClick={() => setTool('brush')}
            className={`w-8 h-8 flex items-center justify-center border text-lg rounded-[2px] ${
              tool === 'brush' ? 'bg-[#D3E5FA] border-[#7F9DB9] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.2)]' : 'xp-btn-classic'
            }`}
            title="Brush"
          >
            🖌️
          </button>
          <button 
            onClick={() => setTool('eraser')}
            className={`w-8 h-8 flex items-center justify-center border text-lg rounded-[2px] ${
              tool === 'eraser' ? 'bg-[#D3E5FA] border-[#7F9DB9] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.2)]' : 'xp-btn-classic'
            }`}
            title="Eraser"
          >
            🧽
          </button>

          <div className="w-8 border-t border-[#A0A0A0] my-2"></div>

          {/* Brush Sizes */}
          <div className="flex flex-col space-y-2 items-center bg-white/50 p-1 border border-gray-300 rounded w-9">
            <button onClick={() => setBrushSize(2)} className={`w-full rounded h-1 bg-black ${brushSize === 2 ? 'ring-2 ring-blue-500' : ''}`} />
            <button onClick={() => setBrushSize(5)} className={`w-full rounded h-2 bg-black ${brushSize === 5 ? 'ring-2 ring-blue-500' : ''}`} />
            <button onClick={() => setBrushSize(9)} className={`w-full rounded h-3 bg-black ${brushSize === 9 ? 'ring-2 ring-blue-500' : ''}`} />
          </div>
        </div>

        {/* Canvas drawing sheet */}
        <div className="flex-grow bg-[#808080] p-1 overflow-auto flex items-center justify-center">
          <div className="bg-white shadow border border-gray-400">
            <canvas 
              ref={canvasRef} 
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="cursor-crosshair bg-white"
            />
          </div>
        </div>
      </div>

      {/* Bottom Color Palette */}
      <div className="bg-[#ECE9D8] border-t border-[#C0C0C0] p-2 flex items-center space-x-3 select-none">
        {/* Selected Color Indicator */}
        <div 
          className="w-7 h-7 border-2 border-white shadow-md rounded-[1px] flex-shrink-0"
          style={{ backgroundColor: color }}
        />

        {/* Color Blocks grid */}
        <div className="grid grid-cols-10 gap-1.5 flex-grow">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="w-4 h-4 border border-gray-400 hover:border-black transition-colors rounded-[1px]"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
