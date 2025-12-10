import React from 'react';
import { Drone } from '../types';
import { Battery, BatteryLow, Wifi, Activity } from 'lucide-react';

interface DroneListProps {
  drones: Drone[];
}

const DroneList: React.FC<DroneListProps> = ({ drones }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 bg-slate-950">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Units ({drones.length})</h3>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2 space-y-2">
        {drones.map(drone => (
          <div key={drone.id} className="bg-slate-800/50 p-3 rounded border border-slate-700 hover:border-slate-500 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono font-bold text-sm text-white">{drone.id}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${drone.flightMode === 'DISARMED' ? 'bg-slate-700 text-slate-300' : 'bg-emerald-900 text-emerald-300'}`}>
                {drone.flightMode}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                {drone.battery > 20 ? <Battery size={12} className="text-emerald-400"/> : <BatteryLow size={12} className="text-rose-500"/>}
                <span className={drone.battery < 20 ? 'text-rose-400' : ''}>{drone.battery.toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity size={12} className="text-blue-400"/>
                <span>{drone.position.z.toFixed(1)}m</span>
              </div>
              <div className="col-span-2 flex items-center gap-1 border-t border-slate-700 pt-1 mt-1">
                 <Wifi size={10} />
                 <span className="text-[10px] truncate">
                   POS: {drone.position.x.toFixed(0)}, {drone.position.y.toFixed(0)}
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroneList;