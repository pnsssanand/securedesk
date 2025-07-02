import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  count,
  icon: Icon,
  color,
  bgColor,
  borderColor,
  isLoading = false
}) => {
  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {isLoading ? (
              <span className="animate-pulse bg-gray-300 rounded w-12 h-8 inline-block"></span>
            ) : (
              count
            )}
          </p>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-xs text-gray-500">Live updates</span>
          </div>
        </div>
        <div className={`${color} p-3 rounded-full shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
