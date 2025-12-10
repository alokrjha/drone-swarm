import React from 'react';
import { FlightMode, FormationType } from '../types';
import { Play, Square, Navigation, Crosshair, Hexagon, Shield, Move } from 'lucide-react';

interface ControlPanelProps {
  currentMode: FlightMode;
  currentFormation: FormationType;
  setMode: (mode: FlightMode) => void;
  setFormation: (fmt: FormationType) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ currentMode, currentFormation, setMode, setFormation }) => {
  
  const ModeButton = ({ mode, icon: Icon, label, color }: any) => (
    <button
      onClick={() => setMode(mode)}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all w-full
        ${currentMode === mode 
          ? `bg-${color}-600 text-white shadow-lg shadow-${color}-900/20` 
          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
        }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col gap-6 h-full">
      
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Mission Control</h3>
        <div className="grid grid-cols-2 gap-3">
          <ModeButton mode={FlightMode.TAKEOFF} icon={Play} label="ARM & TAKEOFF" color="emerald" />
          <ModeButton mode={FlightMode.LAND} icon={Square} label="LAND ALL" color="rose" />
          <ModeButton mode={FlightMode.RTL} icon={Navigation} label="RTL" color="amber" />
          <ModeButton mode={FlightMode.AUTO} icon={Crosshair} label="GUIDED" color="blue" />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Swarm Formation</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setFormation(FormationType.V_SHAPE)}
            className={`p-3 rounded border flex flex-col items-center gap-2 transition-all ${currentFormation === FormationType.V_SHAPE ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800'}`}
          >
            <Shield size={20} />
            <span className="text-xs font-mono">V-FORMATION</span>
          </button>
          
          <button 
            onClick={() => setFormation(FormationType.LINE)}
            className={`p-3 rounded border flex flex-col items-center gap-2 transition-all ${currentFormation === FormationType.LINE ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800'}`}
          >
            <Move size={20} className="rotate-90" />
            <span className="text-xs font-mono">LINE</span>
          </button>

          <button 
            onClick={() => setFormation(FormationType.CIRCLE)}
            className={`p-3 rounded border flex flex-col items-center gap-2 transition-all ${currentFormation === FormationType.CIRCLE ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800'}`}
          >
            <Hexagon size={20} />
            <span className="text-xs font-mono">ORBIT</span>
          </button>
        </div>
      </div>

      <div className="mt-auto bg-slate-950 p-4 rounded border border-slate-800 font-mono text-xs text-slate-500">
        <p>SYSTEM: ONLINE</p>
        <p>MAVLINK: CONNECTED (UDP:14550)</p>
        <p>GPS: 3D FIX (12 SATS)</p>
      </div>

    </div>
  );
};

export default ControlPanel;