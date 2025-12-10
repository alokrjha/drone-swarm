import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code, Server } from 'lucide-react';

interface SetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const SetupGuide: React.FC<SetupGuideProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'env' | 'python'>('env');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pythonCode = `import asyncio
from pymavlink import mavutil

# SWARM CONFIGURATION
DRONES = [
    {'id': 1, 'connection': 'udp:127.0.0.1:14550'},
    {'id': 2, 'connection': 'udp:127.0.0.1:14560'},
    {'id': 3, 'connection': 'udp:127.0.0.1:14570'},
]

class DroneInstance:
    def __init__(self, config):
        self.id = config['id']
        self.conn_str = config['connection']
        self.vehicle = None

    async def connect(self):
        print(f"Drone {self.id}: Connecting to {self.conn_str}...")
        self.vehicle = mavutil.mavlink_connection(self.conn_str)
        self.vehicle.wait_heartbeat()
        print(f"Drone {self.id}: Heartbeat received!")

    async def arm_and_takeoff(self, target_altitude=10):
        print(f"Drone {self.id}: Arming...")
        self.vehicle.mav.command_long_send(
            self.vehicle.target_system,
            self.vehicle.target_component,
            mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
            0, 1, 0, 0, 0, 0, 0, 0)
        
        # Wait for arming (simplified)
        await asyncio.sleep(1)
        
        print(f"Drone {self.id}: Taking off to {target_altitude}m")
        self.vehicle.mav.command_long_send(
            self.vehicle.target_system,
            self.vehicle.target_component,
            mavutil.mavlink.MAV_CMD_NAV_TAKEOFF,
            0, 0, 0, 0, 0, 0, 0, target_altitude)

async def main():
    swarm = [DroneInstance(d) for d in DRONES]
    
    # Connect all drones in parallel
    await asyncio.gather(*[d.connect() for d in swarm])
    
    print("--- SWARM CONNECTED ---")
    
    # Arm and Takeoff sequence
    await asyncio.gather(*[d.arm_and_takeoff(10) for d in swarm])
    
    # Keep script running to monitor
    while True:
        await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(main())`;

  const envSetup = `# 1. System Update (Ubuntu 22.04)
sudo apt update && sudo apt upgrade -y

# 2. Install ROS2 Humble (Middleware)
sudo apt install software-properties-common
sudo add-apt-repository universe
sudo apt update && sudo apt install curl -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
sudo apt update
sudo apt install ros-humble-desktop

# 3. Install ArduPilot Dependencies
git clone https://github.com/ArduPilot/ardupilot.git
cd ardupilot
git submodule update --init --recursive
Tools/environment_install/install-prereqs-ubuntu.sh -y
. ~/.profile

# 4. Install Gazebo (Garden) & Plugins
sudo apt-get install lsb-release gnupg
sudo curl https://packages.osrfoundation.org/gazebo.gpg --output /usr/share/keyrings/pkgs-osrf-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/pkgs-osrf-archive-keyring.gpg] http://packages.osrfoundation.org/gazebo/ubuntu-stable $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/gazebo-stable.list > /dev/null
sudo apt-get update
sudo apt-get install gz-garden

# 5. Install Python MAVLink Tools
pip3 install pymavlink mavproxy dronekit`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-xl border border-slate-700 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="text-blue-500" />
              Demo Deployment Guide
            </h2>
            <p className="text-slate-400 text-sm mt-1">Ubuntu 22.04 • ArduPilot • Gazebo • ROS2</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 px-6">
          <button
            onClick={() => setActiveTab('env')}
            className={`py-4 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'env' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Terminal size={16} />
            Environment Setup
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`py-4 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'python' 
                ? 'border-emerald-500 text-emerald-400' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Code size={16} />
            Python Swarm Controller
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
          <div className="relative group">
            <button
              onClick={() => handleCopy(activeTab === 'env' ? envSetup : pythonCode)}
              className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md text-xs font-mono flex items-center gap-2 border border-slate-600 transition-all opacity-0 group-hover:opacity-100"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copied ? 'COPIED' : 'COPY'}
            </button>

            <pre className="font-mono text-sm text-slate-300 leading-relaxed overflow-x-auto p-4">
              {activeTab === 'env' ? (
                <code className="language-bash">{envSetup}</code>
              ) : (
                <code className="language-python">{pythonCode}</code>
              )}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 rounded-b-xl flex justify-between items-center text-xs text-slate-500">
          <span>* Run the Python script after starting ArduPilot SITL instances.</span>
          <span>Recommended QGroundControl version: Stable 4.2+ (AppImage)</span>
        </div>
      </div>
    </div>
  );
};

export default SetupGuide;