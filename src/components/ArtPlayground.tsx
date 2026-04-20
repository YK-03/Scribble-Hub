import React, { useEffect, useRef, useState } from 'react';
import { Download, Paintbrush, Search, Trash2 } from 'lucide-react';

import AppShell from './AppShell';

const ArtPlayground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = brushSize;
    context.strokeStyle = currentColor;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
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
    context.fillStyle = '#ffffff';
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
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-border bg-background/95 px-8 py-6 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Art Playground</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sketch ideas, explore colors, and save your canvas when it feels right.
              </p>
            </div>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search tools"
                className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-72"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <label htmlFor="color-picker" className="text-sm font-medium text-foreground">
                Color
              </label>
              <input
                id="color-picker"
                type="color"
                value={currentColor}
                onChange={(event) => setCurrentColor(event.target.value)}
                className="h-10 w-10 rounded-full border border-border bg-background"
              />
              <label htmlFor="brush-size" className="text-sm font-medium text-foreground">
                Brush Size
              </label>
              <input
                id="brush-size"
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(event) => setBrushSize(parseInt(event.target.value, 10))}
                className="w-28 accent-primary"
              />
              <button
                onClick={clearCanvas}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-muted px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
              >
                <Trash2 size={16} />
                Clear
              </button>
              <button
                onClick={saveCanvas}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Download size={16} />
                Save
              </button>
              <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm text-muted-foreground">
                <Paintbrush size={16} />
                Ready to draw
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full rounded-xl border border-border bg-white cursor-crosshair"
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default ArtPlayground;
