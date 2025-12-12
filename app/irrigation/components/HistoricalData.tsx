import React from 'react';

interface HistoricalReading {
  id: string;
  timestamp: string;
  soilMoisture: number;
  waterLevel: number;
  turbidity: number;
  action?: string;
}

export const HistoricalData: React.FC = () => {
  // Generate mock historical data
  const historicalData: HistoricalReading[] = [
    {
      id: '1',
      timestamp: '2023-06-15 14:30',
      soilMoisture: 32,
      waterLevel: 72,
      turbidity: 56,
      action: 'Pump ON (AUTO)'
    },
    {
      id: '2',
      timestamp: '2023-06-15 14:15',
      soilMoisture: 28,
      waterLevel: 75,
      turbidity: 48,
      action: 'Threshold reached'
    },
    {
      id: '3',
      timestamp: '2023-06-15 14:00',
      soilMoisture: 35,
      waterLevel: 78,
      turbidity: 45,
      action: ''
    },
    {
      id: '4',
      timestamp: '2023-06-15 13:45',
      soilMoisture: 42,
      waterLevel: 80,
      turbidity: 42,
      action: 'Calibration performed'
    },
    {
      id: '5',
      timestamp: '2023-06-15 13:30',
      soilMoisture: 48,
      waterLevel: 82,
      turbidity: 39,
      action: ''
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Readings</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Soil %</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water (cm)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turbidity (NTU)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {historicalData.map((reading) => (
              <tr key={reading.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{reading.timestamp}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                  reading.soilMoisture < 30 ? 'text-yellow-600' : 'text-gray-900'
                }`}>
                  {reading.soilMoisture}%
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                  reading.waterLevel < 20 ? 'text-red-600' : reading.waterLevel < 25 ? 'text-yellow-600' : 'text-gray-900'
                }`}>
                  {reading.waterLevel}cm
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                  reading.turbidity > 100 ? 'text-yellow-600' : 'text-gray-900'
                }`}>
                  {reading.turbidity}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {reading.action ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {reading.action}
                    </span>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Last 1000 readings stored locally • Synced to server
      </div>
    </div>
  );
};