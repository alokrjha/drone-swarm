import React, { useRef, useEffect } from 'react';
import { Drone, Coordinates, FlightMode } from '../types';

interface TacticalMapProps {
  drones: Drone[];
  targetLocation: Coordinates;
  onMapClick: (coords: Coordinates) => void;
}

const TacticalMap: React.FC<TacticalMapProps> = ({ drones, targetLocation, onMapClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas sizing
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 1.5; // Zoom level

    // Clear
    ctx.fillStyle = '#0f172a'; // Slate 900
    ctx.fillRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = '#1e293b'; // Slate 800
    ctx.lineWidth = 1;
    const gridSize = 40;
    
    // Panning effect based on target
    const panX = -targetLocation.x * scale * 0.1; 
    const panY = -targetLocation.y * scale * 0.1;

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Target Marker
    const targetScreenX = centerX + targetLocation.x * scale;
    const targetScreenY = centerY + targetLocation.y * scale;
    ctx.strokeStyle = '#10b981'; // Emerald 500
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(targetScreenX, targetScreenY, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#10b981';
    ctx.fillText("TARGET", targetScreenX + 20, targetScreenY);

    // Draw Drones
    drones.forEach(drone => {
      const screenX = centerX + drone.position.x * scale;
      const screenY = centerY + drone.position.y * scale;

      // Drone Body (Triangle)
      ctx.save();
      ctx.translate(screenX, screenY);
      ctx.rotate((drone.heading + 90) * Math.PI / 180); // Adjust for canvas rotation

      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(8, 8);
      ctx.lineTo(0, 5);
      ctx.lineTo(-8, 8);
      ctx.closePath();
      
      if (drone.status === 'warning') ctx.fillStyle = '#f59e0b'; // Amber
      else if (drone.flightMode === FlightMode.DISARMED) ctx.fillStyle = '#64748b'; // Slate
      else ctx.fillStyle = '#3b82f6'; // Blue
      
      ctx.fill();
      
      // Altitude Indicator (Shadow size)
      const shadowOffset = drone.position.z * 0.5;
      if (drone.position.z > 1) {
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = 'black';
          ctx.beginPath();
          ctx.arc(0, 0 + shadowOffset, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
      }
      
      ctx.restore();

      // Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(drone.id, screenX + 12, screenY - 12);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`Alt: ${drone.position.z.toFixed(1)}m`, screenX + 12, screenY);
    });

  }, [drones, targetLocation]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 1.5;

    // Inverse transform to get world coordinates
    const worldX = (x - centerX) / scale;
    const worldY = (y - centerY) / scale;
    
    onMapClick({ x: worldX, y: worldY, z: 0 });
  };

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      <div className="absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur px-3 py-1 rounded text-xs text-emerald-400 font-mono border border-slate-600">
        GAZEBO SIMULATOR V.3.2.1-LIVE
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onClick={handleClick}
        className="w-full h-full cursor-crosshair"
      />
    </div>
  );
};

export default TacticalMap;