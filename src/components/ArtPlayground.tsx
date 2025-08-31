import React, { useRef, useEffect, useState } from 'react';

const ArtPlayground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set initial canvas properties
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = brushSize;
    context.strokeStyle = currentColor;
    context.fillStyle = '#ffffff'; // Set canvas background to white
    context.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with white
  }, [brushSize, currentColor]);

  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = '#ffffff'; // Fill with white
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'scribble-hub-art.png';
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#1e1e1e] min-h-screen">
      <div className="bg-[#282828] p-6 rounded-xl shadow-2xl">
        <h2 className="text-center text-3xl font-bold text-white mb-6">Art Playground</h2>
        
        {/* Controls */}
        <div className="flex items-center space-x-4 mb-4">
          <label htmlFor="color-picker" className="text-gray-300">Color:</label>
          <input
            id="color-picker"
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="w-8 h-8 rounded-full border-none"
          />
          <label htmlFor="brush-size" className="text-gray-300">Brush Size:</label>
          <input
            id="brush-size"
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
            className="w-24 accent-[#a050d9]"
          />
          <button
            onClick={clearCanvas}
            className="px-4 py-2 rounded-lg text-white bg-gray-600 hover:bg-gray-500 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={saveCanvas}
            className="px-4 py-2 rounded-lg text-white bg-[#a050d9] hover:bg-[#8e45c4] transition-colors"
          >
            Save
          </button>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border-2 border-[#3e3e3e] rounded-xl cursor-crosshair bg-white"
        />
      </div>
    </div>
  );
};

export default ArtPlayground;