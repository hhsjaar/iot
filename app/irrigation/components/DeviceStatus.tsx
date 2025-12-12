import React from 'react';

interface DeviceStatusProps {
  connectionStatus: 'online' | 'offline';
  batteryLevel: number;
  mode: string;
  uptime: string;
}

export const DeviceStatus: React.FC<DeviceStatusProps> = ({ 
  connectionStatus, 
  batteryLevel, 
  mode,
  uptime 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Status</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Connection</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            connectionStatus === 'online' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {connectionStatus.toUpperCase()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Battery</span>
          <div className="flex items-center">
            <span className="text-gray-900 font-medium mr-2">{batteryLevel}%</span>
            <div className="w-16 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  batteryLevel > 50 ? 'bg-green-500' : 
                  batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                }`} 
                style={{ width: `${batteryLevel}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Mode</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {mode}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Uptime</span>
          <span className="text-gray-900 font-medium">{uptime}</span>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">System Info</div>
          <div className="text-xs text-gray-500 space-y-1">
            <div>Device ID: ESP32_001</div>
            <div>Firmware: v1.2.4</div>
            <div>Last Sync: Just now</div>
          </div>
        </div>
      </div>
    </div>
  );
};