import React from 'react';

interface Alarm {
  id: number;
  type: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
}

interface AlarmPanelProps {
  alarms: Alarm[];
}

export const AlarmPanel: React.FC<AlarmPanelProps> = ({ alarms }) => {
  const getAlarmColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">System Alerts</h3>
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
          {alarms.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {alarms.length > 0 ? (
          alarms.map(alarm => (
            <div 
              key={alarm.id} 
              className={`p-3 rounded-lg border ${getAlarmColor(alarm.type)} flex justify-between items-start`}
            >
              <div>
                <div className="font-medium">{alarm.message}</div>
                <div className="text-xs opacity-80 mt-1">{alarm.timestamp}</div>
              </div>
              <button className="text-sm opacity-70 hover:opacity-100">Acknowledge</button>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No active alerts
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Emergency Procedures</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>• Flood: Drain pump activates at high water rise</div>
          <div>• Sensor failure: Backup systems engaged</div>
          <div>• Power loss: Battery backup active</div>
        </div>
      </div>
    </div>
  );
};