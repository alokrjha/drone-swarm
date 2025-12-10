export const DRONE_COUNT = 5;
export const MAX_ALTITUDE = 100;
export const MAX_SPEED = 15;
export const BATTERY_DRAIN_RATE = 0.05; // % per tick
export const SIMULATION_TICK_RATE = 50; // ms

// Initial positions (random scatter around center)
export const INITIAL_POSITIONS = Array.from({ length: DRONE_COUNT }).map((_, i) => ({
  x: (Math.random() - 0.5) * 200,
  y: (Math.random() - 0.5) * 200,
  z: 0
}));

export const MOCK_LOGS = [
  { id: '1', timestamp: '10:00:01', level: 'info', message: 'System initialized. Waiting for MavLink...' },
  { id: '2', timestamp: '10:00:02', level: 'success', message: 'Connected to ArduPilot SITL Backend.' },
  { id: '3', timestamp: '10:00:03', level: 'info', message: 'Gazebo Physics Engine active.' },
];