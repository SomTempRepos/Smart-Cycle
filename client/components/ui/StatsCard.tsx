'use client';

import { Navigation, Gauge, BatteryFull, Clock } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
  trendIcon?: React.ComponentType<{ className?: string }>;
  gradient?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'orange' | string;
  valueColor?: 'dynamic' | 'white' | 'auto' | string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

export default function StatsCard({
  title,
  value,
  unit,
  icon: Icon,
  trendIcon: TrendIcon,
  gradient = 'blue',
  valueColor = 'white',
  size = 'medium',
  className = '',
  onClick
}: StatsCardProps) {
  
  // Predefined gradient styles
  const gradientClasses = {
    blue: 'from-blue-900 to-blue-800',
    green: 'from-green-900 to-green-800',
    purple: 'from-purple-900 to-purple-800',
    yellow: 'from-yellow-900 to-yellow-800',
    red: 'from-red-900 to-red-800',
    orange: 'from-orange-900 to-orange-800'
  };

  // Size variants
  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const iconSizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  const textSizeClasses = {
    small: 'text-xl',
    medium: 'text-3xl',
    large: 'text-4xl'
  };

  const backgroundIconSizeClasses = {
    small: 'p-2',
    medium: 'p-3',
    large: 'p-4'
  };

  // Get gradient class (use predefined or custom)
  const gradientClass = typeof gradient === 'string' && gradientClasses[gradient as keyof typeof gradientClasses]
    ? gradientClasses[gradient as keyof typeof gradientClasses]
    : gradient;

  // Get icon colors based on gradient
  const getIconColors = () => {
    switch (gradient) {
      case 'blue':
        return { main: 'text-blue-300', bg: 'bg-blue-700/30', accent: 'text-blue-400' };
      case 'green':
        return { main: 'text-green-300', bg: 'bg-green-700/30', accent: 'text-green-400' };
      case 'purple':
        return { main: 'text-purple-300', bg: 'bg-purple-700/30', accent: 'text-purple-400' };
      case 'yellow':
        return { main: 'text-yellow-300', bg: 'bg-yellow-700/30', accent: 'text-yellow-400' };
      case 'red':
        return { main: 'text-red-300', bg: 'bg-red-700/30', accent: 'text-red-400' };
      case 'orange':
        return { main: 'text-orange-300', bg: 'bg-orange-700/30', accent: 'text-orange-400' };
      default:
        return { main: 'text-blue-300', bg: 'bg-blue-700/30', accent: 'text-blue-400' };
    }
  };

  const colors = getIconColors();

  // Get title color based on gradient
  const getTitleColor = () => {
    switch (gradient) {
      case 'blue': return 'text-blue-200';
      case 'green': return 'text-green-200';
      case 'purple': return 'text-purple-200';
      case 'yellow': return 'text-yellow-200';
      case 'red': return 'text-red-200';
      case 'orange': return 'text-orange-200';
      default: return 'text-blue-200';
    }
  };

  // Get unit color based on gradient
  const getUnitColor = () => {
    switch (gradient) {
      case 'blue': return 'text-blue-300';
      case 'green': return 'text-green-300';
      case 'purple': return 'text-purple-300';
      case 'yellow': return 'text-yellow-300';
      case 'red': return 'text-red-300';
      case 'orange': return 'text-orange-300';
      default: return 'text-blue-300';
    }
  };

  // Get value color
  const getValueColor = () => {
    if (valueColor === 'white') return 'text-white';
    if (valueColor === 'auto') return colors.main;
    if (valueColor === 'dynamic') return 'text-white'; // For dynamic, let parent handle the color
    return valueColor; // Custom color class
  };

  return (
    <div 
      className={`bg-gradient-to-br ${gradientClass} ${sizeClasses[size]} rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 ${className}`}
      onClick={onClick}
    >
      {/* Header with icons */}
      <div className="flex items-center justify-between mb-4">
        <div className={`${colors.bg} ${backgroundIconSizeClasses[size]} rounded-lg`}>
          <Icon className={`${iconSizeClasses[size]} ${colors.main}`} />
        </div>
        {TrendIcon && (
          <TrendIcon className={`h-5 w-5 ${colors.accent}`} />
        )}
      </div>

      {/* Title */}
      <h3 className={`${getTitleColor()} text-sm font-medium mb-2`}>
        {title}
      </h3>

      {/* Value and Unit */}
      <div className="flex items-end space-x-2">
        <p className={`${textSizeClasses[size]} font-bold ${getValueColor()}`}>
          {value}
        </p>
        {unit && (
          <p className={`${getUnitColor()} text-lg mb-1`}>
            {unit}
          </p>
        )}
      </div>
    </div>
  );
}

// Preset components for common use cases
export const DistanceCard = ({ value, trendIcon, onClick }: { value: string | number; trendIcon?: React.ComponentType<{ className?: string }>; onClick?: () => void }) => (
  <StatsCard
    title="Distance"
    value={value}
    unit="km"
    icon={Navigation}
    trendIcon={trendIcon}
    gradient="blue"
    onClick={onClick}
  />
);

export const SpeedCard = ({ value, trendIcon, valueColor = 'white', onClick }: { value: string | number; trendIcon?: React.ComponentType<{ className?: string }>; valueColor?: string; onClick?: () => void }) => (
  <StatsCard
    title="Speed"
    value={value}
    unit="km/h"
    icon={Gauge}
    trendIcon={trendIcon}
    gradient="green"
    valueColor={valueColor}
    onClick={onClick}
  />
);

export const BatteryCard = ({ value, trendIcon, valueColor = 'white', onClick }: { value: string | number; trendIcon?: React.ComponentType<{ className?: string }>; valueColor?: string; onClick?: () => void }) => (
  <StatsCard
    title="Battery"
    value={value}
    unit="%"
    icon={BatteryFull}
    trendIcon={trendIcon}
    gradient="yellow"
    valueColor={valueColor}
    onClick={onClick}
  />
);

export const TimeCard = ({ value, trendIcon, onClick }: { value: string | number; trendIcon?: React.ComponentType<{ className?: string }>; onClick?: () => void }) => (
  <StatsCard
    title="Session Time"
    value={value}
    unit="min"
    icon={Clock}
    trendIcon={trendIcon}
    gradient="purple"
    onClick={onClick}
  />
);