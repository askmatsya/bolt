'use client';

import React, { useEffect, useRef } from 'react';

interface VoiceVisualizationProps {
  audioLevel: number;
  isActive: boolean;
  className?: string;
}

export const VoiceVisualization: React.FC<VoiceVisualizationProps> = ({
  audioLevel,
  isActive,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const { width, height } = canvas;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      if (!isActive) {
        // Draw flat line when inactive
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        return;
      }

      // Draw waveform bars
      const barCount = 40;
      const barWidth = width / barCount;
      const maxBarHeight = height * 0.8;

      for (let i = 0; i < barCount; i++) {
        const x = i * barWidth;
        
        // Create a wave effect based on audio level and position
        const wave = Math.sin((i * 0.3) + (Date.now() * 0.01)) * 0.5 + 0.5;
        const adjustedLevel = Math.max(0.1, audioLevel + (wave * 0.3));
        const barHeight = adjustedLevel * maxBarHeight;
        
        // Gradient color based on audio level
        const intensity = Math.min(1, audioLevel * 2);
        const red = Math.floor(255 * intensity);
        const green = Math.floor(255 * (1 - intensity));
        
        ctx.fillStyle = `rgb(${red}, ${green}, 100)`;
        ctx.fillRect(x, (height - barHeight) / 2, barWidth - 1, barHeight);
      }

      if (isActive) {
        animationFrameRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioLevel, isActive]);

  return (
    <div className={`bg-gray-100 dark:bg-gray-700 rounded-lg p-4 ${className}`}>
      <canvas
        ref={canvasRef}
        width={400}
        height={80}
        className="w-full h-20 rounded"
        style={{ maxWidth: '100%' }}
      />
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {isActive ? 'Listening...' : 'Ready to record'}
        </span>
      </div>
    </div>
  );
};