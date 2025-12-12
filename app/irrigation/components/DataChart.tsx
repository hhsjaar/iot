import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DataChartProps {
  recentReadings: Array<{
    soilMoisture?: string;
    waterLevel?: string;
    turbidity?: string;
    timestamp: string;
  }>;
}

export const DataChart: React.FC<DataChartProps> = ({ recentReadings }) => {
  // Process the data from the API for the chart
  const chartData = recentReadings.map(reading => ({
    time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    soil: parseFloat(reading.soilMoisture || '0'),
    water: parseFloat(reading.waterLevel || '0'),
    turbidity: parseFloat(reading.turbidity || '0'),
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="soil"
            name="Soil Moisture (%)"
            stroke="#10b981"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="water"
            name="Water Level (cm)"
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="turbidity"
            name="Turbidity (NTU)"
            stroke="#f59e0b"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};