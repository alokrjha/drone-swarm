import { useState, useEffect, useCallback, useRef } from 'react';
import { Drone, FlightMode, FormationType, Coordinates } from '../types';
import { DRONE_COUNT, SIMULATION_TICK_RATE, BATTERY_DRAIN_RATE } from '../constants';

// Helper to calculate target position based on formation
const getTargetPosition = (index: number, total: number, formation: FormationType, center: Coordinates): Coordinates => {
  const spacing = 40;
  
  switch (formation) {
    case FormationType.LINE:
      return { 
        x: center.x + (index - (total - 1) / 2) * spacing, 
        y: center.y, 
        z: 20 
      };
    case FormationType.V_SHAPE:
      const offset = Math.abs(index - (total - 1) / 2);
      return { 
        x: center.x + (index - (total - 1) / 2) * spacing, 
        y: center.y - offset * (spacing * 0.8), 
        z: 20 + offset * 2 
      };
    case FormationType.CIRCLE:
      const angle = (index / total) * Math.PI * 2;
      const radius = 60;
      return {
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
        z: 25
      };
    case FormationType.RANDOM:
    default:
      return { x: center.x, y: center.y, z: 10 }; // Will just hover loosely
  }
};

export const useDroneSimulation = () => {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [formation, setFormation] = useState<FormationType>(FormationType.RANDOM);
  const [targetLocation, setTargetLocation] = useState<Coordinates>({ x: 0, y: 0, z: 0 });
  const [globalMode, setGlobalMode] = useState<FlightMode>(FlightMode.DISARMED);

  // Initialize
  useEffect(() => {
    const initialDrones: Drone[] = Array.from({ length: DRONE_COUNT }).map((_, i) => ({
      id: `D-${100 + i}`,
      position: { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      battery: 100,
      status: 'ok',
      heading: 0,
      flightMode: FlightMode.DISARMED
    }));
    setDrones(initialDrones);
  }, []);

  const updateSim = useCallback(() => {
    setDrones(prevDrones => {
      return prevDrones.map((drone, index) => {
        if (globalMode === FlightMode.DISARMED) {
          return drone;
        }

        let target = { ...targetLocation };
        
        // Formation logic overrides basic target
        if (globalMode === FlightMode.AUTO || globalMode === FlightMode.TAKEOFF || globalMode === FlightMode.HOLD) {
           const formPos = getTargetPosition(index, prevDrones.length, formation, targetLocation);
           target = formPos;
           if (globalMode === FlightMode.TAKEOFF) target.z = 10;
        }

        if (globalMode === FlightMode.LAND) {
           target.z = 0;
        }
        
        if (globalMode === FlightMode.RTL) {
           target = { x: (Math.random() - 0.5) * 50, y: (Math.random() - 0.5) * 50, z: 0 };
           if (drone.position.z > 5 && Math.abs(drone.position.x - target.x) < 5) {
             target.z = 0; // Descend when close
           } else {
             target.z = 20; // Stay high until home
           }
        }

        // Physics: PID-like movement towards target
        const kP = 0.05; // Proportional gain
        const dx = target.x - drone.position.x;
        const dy = target.y - drone.position.y;
        const dz = target.z - drone.position.z;

        const newVelX = dx * kP;
        const newVelY = dy * kP;
        const newVelZ = dz * kP;

        // Apply battery drain based on effort
        const effort = Math.sqrt(newVelX**2 + newVelY**2 + newVelZ**2);
        const drain = (effort * 0.05 + 0.01) * BATTERY_DRAIN_RATE;

        // Heading
        const heading = Math.atan2(newVelY, newVelX) * (180 / Math.PI);

        // Update Position
        const newX = drone.position.x + newVelX;
        const newY = drone.position.y + newVelY;
        const newZ = Math.max(0, drone.position.z + newVelZ); // Floor at 0

        // Auto state switching
        let currentMode = globalMode;
        if (globalMode === FlightMode.LAND && newZ < 0.5) currentMode = FlightMode.DISARMED;

        return {
          ...drone,
          position: { x: newX, y: newY, z: newZ },
          velocity: { x: newVelX, y: newVelY, z: newVelZ },
          battery: Math.max(0, drone.battery - drain),
          heading: heading,
          flightMode: currentMode,
          status: drone.battery < 20 ? 'warning' : 'ok'
        };
      });
    });
  }, [formation, targetLocation, globalMode]);

  useEffect(() => {
    const interval = setInterval(updateSim, SIMULATION_TICK_RATE);
    return () => clearInterval(interval);
  }, [updateSim]);

  return {
    drones,
    formation,
    setFormation,
    targetLocation,
    setTargetLocation,
    globalMode,
    setGlobalMode
  };
};