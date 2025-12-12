import React, { useState } from 'react';

interface PumpControlProps {
  status: string;
  mode: string;
  onToggle: (status: string) => void;
  onModeChange: (mode: string) => void;
}

export const PumpControl: React.FC<PumpControlProps> = ({ 
  status, 
  mode, 
  onToggle, 
  onModeChange 
}) => {
  const [tempMode, setTempMode] = useState(mode);

  const handleModeChange = () => {
    const newMode = tempMode === 'AUTO' ? 'MANUAL' : 'AUTO';
    onModeChange(newMode);
    setTempMode(newMode);
  };

  const togglePump = () => {
    const newStatus = status === 'ON' ? 'OFF' : 'ON';
    onToggle(newStatus);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Pump Control</h3>
      
      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-700">Current Mode:</span>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            mode === 'AUTO' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {mode}
          </span>
          <button 
            onClick={handleModeChange}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-sm"
          >
            Switch
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-700">Pump Status:</span>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === 'ON' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {status}
          </span>
          <button 
            onClick={togglePump}
            className={`px-4 py-2 rounded-md text-white text-sm ${
              status === 'ON' 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {status === 'ON' ? 'Turn Off' : 'Turn On'}
          </button>
        </div>
      </div>

      {mode === 'AUTO' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Auto Operation Rules:</div>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Soil moisture &lt; 30%</li>
            <li>• Water level &gt; 20cm</li>
            <li>• Water turbidity &lt; 100 NTU</li>
            <li>• No pump operation in last 30 mins</li>
          </ul>
        </div>
      )}

      {mode === 'MANUAL' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Manual Override Active</div>
          <div className="text-xs text-gray-500">
            Pump will operate according to manual commands regardless of sensor values
          </div>
        </div>
      )}
    </div>
  );
};