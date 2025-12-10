export enum FlightMode {
  DISARMED = 'DISARMED',
  ARMED = 'ARMED',
  TAKEOFF = 'TAKEOFF',
  HOLD = 'HOLD',
  RTL = 'RTL', // Return to Launch
  AUTO = 'AUTO',
  LAND = 'LAND'
}

export enum FormationType {
  RANDOM = 'RANDOM',
  V_SHAPE = 'V_SHAPE',
  LINE = 'LINE',
  CIRCLE = 'CIRCLE'
}

export interface Coordinates {
  x: number;
  y: number;
  z: number; // Altitude
}

export interface Drone {
  id: string;
  position: Coordinates;
  velocity: Coordinates;
  battery: number;
  status: 'ok' | 'warning' | 'error';
  heading: number;
  flightMode: FlightMode;
}

export interface LogMessage {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export interface SwarmStats {
  activeDrones: number;
  avgBattery: number;
  avgAltitude: number;
  missionTime: number;
}