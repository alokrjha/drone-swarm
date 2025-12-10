import { GoogleGenAI } from "@google/genai";
import { Drone, LogMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMissionData = async (
  drones: Drone[],
  logs: LogMessage[]
): Promise<string> => {
  try {
    const droneSummary = drones.map(d => 
      `Drone ${d.id}: Bat ${d.battery.toFixed(1)}%, Alt ${d.position.z.toFixed(1)}m, Mode ${d.flightMode}`
    ).join('\n');

    const recentLogs = logs.slice(-5).map(l => `[${l.level.toUpperCase()}] ${l.message}`).join('\n');

    const prompt = `
      You are an AI Mission Analyst for a drone swarm. Analyze the following telemetry and logs.
      
      TELEMETRY:
      ${droneSummary}
      
      RECENT LOGS:
      ${recentLogs}
      
      Provide a concise status report (max 100 words). 
      1. Assess swarm health (Battery, Formation integrity).
      2. Identify any anomalies.
      3. Recommend next tactical action (e.g., Return to Launch, Continue Mission).
      Use a military/engineering tone.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Error connecting to AI Mission Analyst. Check API connectivity.";
  }
};