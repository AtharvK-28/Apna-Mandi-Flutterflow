import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsCard = ({ title, value, subtitle, icon, trend, color = 'text-primary' }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-muted ${color}`}>
          <Icon name={icon} size={20} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-xs ${
            trend.type === 'up' ? 'text-success' : 
            trend.type === 'down' ? 'text-error' : 'text-muted-foreground'
          }`}>
            <Icon 
              name={trend.type === 'up' ? 'TrendingUp' : trend.type === 'down' ? 'TrendingDown' : 'Minus'} 
              size={12} 
            />
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-card-foreground mb-1">{value}</h3>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default QuickStatsCard;