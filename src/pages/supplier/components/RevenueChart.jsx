import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RevenueChart = ({ data, period, onPeriodChange }) => {
  const [chartType, setChartType] = useState('line');

  const periodOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-card-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">{entry.dataKey}:</span>
              <span className="text-sm font-medium text-card-foreground">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const averageRevenue = totalRevenue / data.length;
  const growth = data.length > 1 ? 
    ((data[data.length - 1].revenue - data[data.length - 2].revenue) / data[data.length - 2].revenue * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-card-foreground">Revenue Analytics</h3>
          <div className="flex items-center space-x-2">
            <div className="flex bg-muted/30 rounded-lg p-1">
              <button
                onClick={() => setChartType('line')}
                className={`p-1 rounded-md transition-colors duration-200 ${
                  chartType === 'line' ?'bg-card text-card-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="TrendingUp" size={14} />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-1 rounded-md transition-colors duration-200 ${
                  chartType === 'bar' ?'bg-card text-card-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="BarChart3" size={14} />
              </button>
            </div>
            <select
              value={period}
              onChange={(e) => onPeriodChange(e.target.value)}
              className="text-xs border border-border rounded-md px-2 py-1 bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <p className="text-lg font-bold text-card-foreground">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-card-foreground">{formatCurrency(averageRevenue)}</p>
            <p className="text-xs text-muted-foreground">Average</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <p className={`text-lg font-bold ${growth >= 0 ? 'text-success' : 'text-error'}`}>
                {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
              </p>
              <Icon 
                name={growth >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                size={14} 
                className={growth >= 0 ? 'text-success' : 'text-error'} 
              />
            </div>
            <p className="text-xs text-muted-foreground">Growth</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-3">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="period" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: 'var(--color-primary)', strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="period" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="revenue" 
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={12} />
              <span>Last updated: {new Date().toLocaleDateString('en-IN')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="text-xs px-2 py-1">
              <Icon name="Download" size={12} className="mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="text-xs px-2 py-1">
              <Icon name="ExternalLink" size={12} className="mr-1" />
              Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;