import React, { useState } from 'react';
import { useDroneSimulation } from './hooks/useDroneSimulation';
import TacticalMap from './components/TacticalMap';
import ControlPanel from './components/ControlPanel';
import TelemetryCharts from './components/TelemetryCharts';
import AIAnalysis from './components/AIAnalysis';
import DroneList from './components/DroneList';
import SetupGuide from './components/SetupGuide';
import { MOCK_LOGS } from './constants';
import { Activity, Terminal, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const { 
    drones, 
    formation, 
    setFormation, 
    targetLocation, 
    setTargetLocation,
    globalMode,
    setGlobalMode
  } = useDroneSimulation();

  const [logs, setLogs] = useState(MOCK_LOGS);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  // Helper to add logs (simulated)
  const addLog = (msg: string) => {
    setLogs(prev => [...prev, {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      level: 'info' as const,
      message: msg
    }]);
  };

  const handleModeChange = (mode: any) => {
    setGlobalMode(mode);
    addLog(`Swarm mode changed to ${mode}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-6 flex flex-col gap-6">
      
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">SwarmCommander <span className="text-blue-500">AI</span></h1>
            <p className="text-xs text-slate-500 font-mono">ARDUPILOT // GAZEBO INTERFACE // V.1.0</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsSetupOpen(true)}
             className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs font-semibold text-slate-300 transition-colors"
           >
             <BookOpen size={14} />
             DEPLOYMENT GUIDE
           </button>
           <div className="hidden md:block text-right">
             <p className="text-xs font-bold text-emerald-500">SYSTEM HEALTHY</p>
             <p className="text-xs text-slate-600 font-mono">UPTIME: 00:42:12</p>
           </div>
           <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
             <span className="text-xs font-bold">JD</span>
           </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
        
        {/* Left Column: Map & Telemetry (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 min-h-[400px]">
            <TacticalMap 
              drones={drones} 
              targetLocation={targetLocation}
              onMapClick={(coords) => {
                setTargetLocation(coords);
                addLog(`Target updated: X:${coords.x.toFixed(0)} Y:${coords.y.toFixed(0)}`);
              }}
            />
          </div>
          <div>
             <TelemetryCharts drones={drones} />
          </div>
        </div>

        {/* Right Column: Controls & Lists (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
          
          <div className="flex-none">
            <ControlPanel 
              currentMode={globalMode} 
              currentFormation={formation}
              setMode={handleModeChange}
              setFormation={(fmt) => {
                setFormation(fmt);
                addLog(`Formation change requested: ${fmt}`);
              }}
            />
          </div>

          <div className="flex-1 min-h-[200px]">
             <DroneList drones={drones} />
          </div>

          <div className="flex-none min-h-[200px]">
            <AIAnalysis drones={drones} logs={logs} />
          </div>

        </div>

      </main>

      {/* Logs Overlay (Bottom) */}
      <div className="fixed bottom-6 left-6 w-96 max-h-48 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-4 shadow-2xl overflow-y-auto hidden xl:block">
        <h4 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2">
          <Terminal size={12} /> SYSTEM LOGS
        </h4>
        <ul className="space-y-1 font-mono text-xs">
          {logs.slice(-6).map((log) => (
            <li key={log.id} className="text-slate-400">
              <span className="text-slate-600">[{log.timestamp}]</span>{' '}
              <span className={log.level === 'error' ? 'text-rose-400' : log.level === 'success' ? 'text-emerald-400' : 'text-slate-300'}>
                {log.message}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <SetupGuide isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} />

    </div>
  );
};

export default App;