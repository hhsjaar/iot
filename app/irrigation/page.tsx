'use client';

import { useState, useEffect } from 'react';
import { SensorCard } from './components/SensorCard';
import { PumpControl } from './components/PumpControl';
import { DataChart } from './components/DataChart';
import { DeviceStatus } from './components/DeviceStatus';
import { HistoricalData } from './components/HistoricalData';
import { AlarmPanel } from './components/AlarmPanel';

const IrrigationDashboard = () => {
  const [sensorData, setSensorData] = useState({
    soilMoisture: 45,
    waterLevel: 65,
    turbidity: 42,
    pumpStatus: false,
    mode: 'AUTO',
    timestamp: new Date().toISOString(),
  });

  const [recentReadings, setRecentReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track if component has mounted to prevent hydration errors
  const [isMounted, setIsMounted] = useState(false);

  // Fetch data from the API
  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      try {
        const response = await fetch('/api/irrigation/data');
        const data = await response.json();
        
        if (data.sensorData) {
          setSensorData({
            soilMoisture: parseFloat(data.sensorData.soilMoisture) || 45,
            waterLevel: parseFloat(data.sensorData.waterLevel) || 65,
            turbidity: parseFloat(data.sensorData.turbidity) || 42,
            pumpStatus: data.pumpStatus || false,
            mode: data.mode || 'AUTO',
            timestamp: data.sensorData.timestamp || new Date().toISOString(),
          });
          
          if (data.recentReadings) {
            setRecentReadings(data.recentReadings);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Use initial values for server render, then updated values after mount
  const displaySensorData = isMounted ? sensorData : {
    soilMoisture: 45,
    waterLevel: 65,
    turbidity: 42,
    pumpStatus: false,
    mode: 'AUTO',
    timestamp: new Date().toISOString(),
  };

  if (loading && isMounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading irrigation data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">System Dashboard</h2>
        <div className="text-sm text-gray-600">
          Last updated: {isMounted ? new Date(displaySensorData.timestamp).toLocaleTimeString() : 'Just now'}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Sensors */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SensorCard 
              title="Soil Moisture" 
              value={displaySensorData.soilMoisture} 
              unit="%" 
              status={displaySensorData.soilMoisture < 30 ? 'warning' : 'normal'} 
              threshold={30}
              icon="🌱"
            />
            <SensorCard 
              title="Water Level" 
              value={displaySensorData.waterLevel} 
              unit="cm" 
              status={displaySensorData.waterLevel < 15 ? 'critical' : displaySensorData.waterLevel < 25 ? 'warning' : 'normal'} 
              threshold={20}
              icon="💧"
            />
            <SensorCard 
              title="Water Turbidity" 
              value={displaySensorData.turbidity} 
              unit="NTU" 
              status={displaySensorData.turbidity > 100 ? 'warning' : 'normal'} 
              threshold={100}
              icon="🌊"
            />
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sensor Readings Over Time</h3>
            <DataChart recentReadings={recentReadings} />
          </div>

          {/* Historical Data */}
          <HistoricalData />
        </div>

        {/* Right Column - Controls */}
        <div className="space-y-6">
          <DeviceStatus 
            connectionStatus="online" 
            batteryLevel={87} 
            mode={displaySensorData.mode} 
            uptime="12 days, 4 hours" 
          />
          
          <PumpControl 
            status={displaySensorData.pumpStatus ? 'ON' : 'OFF'} 
            mode={displaySensorData.mode}
            onToggle={async (newStatus) => {
              try {
                const response = await fetch('/api/irrigation/data', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    pumpStatus: newStatus === 'ON',
                    operationMode: displaySensorData.mode,
                  }),
                });
                
                if (response.ok) {
                  setSensorData(prev => ({
                    ...prev,
                    pumpStatus: newStatus === 'ON',
                  }));
                }
              } catch (error) {
                console.error('Error updating pump status:', error);
              }
            }}
            onModeChange={async (newMode) => {
              try {
                const response = await fetch('/api/irrigation/data', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    pumpStatus: displaySensorData.pumpStatus,
                    operationMode: newMode,
                  }),
                });
                
                if (response.ok) {
                  setSensorData(prev => ({
                    ...prev,
                    mode: newMode,
                  }));
                }
              } catch (error) {
                console.error('Error updating mode:', error);
              }
            }}
          />
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Controls</h3>
            <div className="space-y-3">
              <button className="w-full py-2 px-4 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors">
                Calibrate Sensors
              </button>
              <button className="w-full py-2 px-4 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors">
                Download Data
              </button>
              <button className="w-full py-2 px-4 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors">
                Update Config
              </button>
            </div>
          </div>

          <AlarmPanel alarms={[]} />
        </div>
      </div>
    </div>
  );
};

export default IrrigationDashboard;