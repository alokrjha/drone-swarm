import React, { useState } from 'react';
import { Drone, LogMessage } from '../types';
import { analyzeMissionData } from '../services/geminiService';
import { Bot, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

interface AIAnalysisProps {
  drones: Drone[];
  logs: LogMessage[];
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ drones, logs }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeMissionData(drones, logs);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Bot size={64} className="text-purple-500" />
      </div>

      <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2 mb-4">
        <Bot size={18} />
        AI MISSION ANALYST
      </h3>

      <div className="flex-1 overflow-y-auto mb-4 bg-slate-950/50 rounded-lg p-4 border border-slate-800">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-500 animate-pulse gap-2">
            <RefreshCw className="animate-spin" size={16} />
            Analyzing telemetry...
          </div>
        ) : analysis ? (
          <div className="prose prose-invert prose-sm">
            <p className="whitespace-pre-line text-slate-300 font-mono text-sm">{analysis}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
            <p className="text-xs text-center">Ready to analyze swarm metrics.</p>
          </div>
        )}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-900/20"
      >
        {loading ? 'Processing...' : 'Generate Mission Report'}
      </button>
      
      {/* Mini status indicator */}
      <div className="mt-4 flex gap-4 text-xs font-mono border-t border-slate-800 pt-3">
         <div className="flex items-center gap-1 text-emerald-400">
             <CheckCircle size={12} />
             <span>MODEL: GEMINI 2.5</span>
         </div>
         <div className="flex items-center gap-1 text-amber-500">
             <AlertTriangle size={12} />
             <span>LATENCY: 42ms</span>
         </div>
      </div>
    </div>
  );
};

export default AIAnalysis;