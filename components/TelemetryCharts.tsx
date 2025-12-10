import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Drone } from '../types';

interface TelemetryChartsProps {
  drones: Drone[];
}

// Generate some mock history data based on current drone state for visualization
const generateData = (drones: Drone[]) => {
    const avgAlt = drones.reduce((acc, d) => acc + d.position.z, 0) / drones.length;
    const avgSpeed = drones.reduce((acc, d) => acc + Math.sqrt(d.velocity.x**2 + d.velocity.y**2), 0) / drones.length;
    
    // In a real app, this would come from a history buffer
    return Array.from({length: 20}).map((_, i) => ({
        time: i,
        altitude: Math.max(0, avgAlt + (Math.random() - 0.5) * 2),
        speed: Math.max(0, avgSpeed + (Math.random() - 0.5))
    }));
};

const TelemetryCharts: React.FC<TelemetryChartsProps> = ({ drones }) => {
  const data = generateData(drones);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-48">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h4 className="text-xs font-bold text-slate-500 mb-2">AVG ALTITUDE (m)</h4>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis hide />
            <YAxis hide domain={[0, 50]} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                itemStyle={{ color: '#10b981' }}
            />
            <Area type="monotone" dataKey="altitude" stroke="#10b981" fillOpacity={1} fill="url(#colorAlt)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h4 className="text-xs font-bold text-slate-500 mb-2">AVG SPEED (m/s)</h4>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis hide />
            <YAxis hide domain={[0, 10]} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                itemStyle={{ color: '#3b82f6' }}
            />
            <Area type="monotone" dataKey="speed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSpeed)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TelemetryCharts;