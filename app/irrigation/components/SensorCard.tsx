import React from 'react';

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  threshold?: number;
  icon: string;
}

export const SensorCard: React.FC<SensorCardProps> = ({ 
  title, 
  value, 
  unit, 
  status, 
  threshold,
  icon 
}) => {
  const statusColors = {
    normal: 'border-green-500 bg-green-50 text-green-800',
    warning: 'border-yellow-500 bg-yellow-50 text-yellow-800',
    critical: 'border-red-500 bg-red-50 text-red-800',
  };

  const statusIcons = {
    normal: '✅',
    warning: '⚠️',
    critical: '🚨',
  };

  return (
    <div className={`rounded-xl border-l-4 ${statusColors[status]} p-5 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{icon}</span>
          <h3 className="font-medium">{title}</h3>
        </div>
        <span className="text-lg font-bold">{statusIcons[status]}</span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold">
            {typeof value === 'number' ? value.toFixed(1) : value}
            <span className="text-base font-normal ml-1">{unit}</span>
          </div>
          {threshold !== undefined && (
            <div className="text-xs mt-1">
              Threshold: {threshold}{unit}
            </div>
          )}
        </div>
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#eee"
              strokeWidth="2"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#10b981'}
              strokeWidth="2"
              strokeDasharray={`${(value / 100) * 100}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            {value}%
          </div>
        </div>
      </div>
    </div>
  );
};