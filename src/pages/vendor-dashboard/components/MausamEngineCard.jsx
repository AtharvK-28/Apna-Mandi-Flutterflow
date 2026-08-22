import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MausamEngineCard = () => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  // Mock forecast — blends weather, festival calendar, local events and
  // anonymized corridor demand data
  const forecast = {
    day: 'Tomorrow, Thursday',
    footfallChange: -30,
    confidence: 87,
    corridorVendors: 142,
    signals: [
      {
        icon: 'CloudRain',
        label: 'Light rain expected',
        detail: '60% chance between 4–8 PM'
      },
      {
        icon: 'CalendarDays',
        label: 'Ekadashi (fasting day)',
        detail: 'Lighter meals, fried snacks dip at lunch'
      },
      {
        icon: 'Tv',
        label: 'IND vs AUS final, 7 PM',
        detail: 'Evening chai & pakora spike near screens'
      }
    ],
    recommendations: [
      {
        item: 'Dosa batter',
        usual: '20 kg',
        suggested: '12 kg',
        change: -40,
        reason: 'Rain + fasting day cuts lunch footfall'
      },
      {
        item: 'Milk (chai)',
        usual: '15 L',
        suggested: '22 L',
        change: 45,
        reason: 'Match-evening chai rush expected'
      },
      {
        item: 'Besan (pakora)',
        usual: '4 kg',
        suggested: '7 kg',
        change: 75,
        reason: 'Rain + cricket = pakora weather'
      },
      {
        item: 'Fresh fruit (juice)',
        usual: '12 kg',
        suggested: '6 kg',
        change: -50,
        reason: 'Rain kills juice demand'
      }
    ]
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/15 to-secondary/15 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="CloudSun" size={20} color="white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-semibold text-card-foreground">Mausam Engine</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <Icon name="Sparkles" size={12} className="mr-1" />
                  AI Prep Forecast
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{forecast.day}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xl font-bold ${forecast.footfallChange < 0 ? 'text-warning' : 'text-success'}`}>
              {forecast.footfallChange > 0 ? '+' : ''}{forecast.footfallChange}%
            </p>
            <p className="text-xs text-muted-foreground">expected footfall</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Signals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          {forecast.signals.map((signal, index) => (
            <div key={index} className="flex items-start space-x-2 bg-muted rounded-md p-2">
              <Icon name={signal.icon} size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-card-foreground">{signal.label}</p>
                <p className="text-xs text-muted-foreground">{signal.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Prep recommendations */}
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium text-card-foreground">Suggested prep for tomorrow</p>
          {forecast.recommendations.map((rec, index) => (
            <div key={index} className="flex items-center justify-between py-1.5 border-b border-border last:border-b-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-card-foreground">{rec.item}</p>
                {showDetails && (
                  <p className="text-xs text-muted-foreground">{rec.reason}</p>
                )}
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <p className="text-sm text-muted-foreground">
                  <span className="line-through">{rec.usual}</span>
                  <Icon name="ArrowRight" size={12} className="inline mx-1" />
                  <span className="font-semibold text-card-foreground">{rec.suggested}</span>
                </p>
                <span className={`inline-flex items-center w-14 justify-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                  rec.change < 0 ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                }`}>
                  <Icon name={rec.change < 0 ? 'TrendingDown' : 'TrendingUp'} size={12} className="mr-0.5" />
                  {rec.change > 0 ? '+' : ''}{rec.change}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Confidence + why */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full text-left mb-3 p-2 bg-muted rounded-md hover:bg-muted/70 transition-colors duration-200"
        >
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground">
              {forecast.confidence}% confidence — learned from {forecast.corridorVendors} vendors in your corridor
            </span>
          </div>
          <Icon name={showDetails ? 'ChevronUp' : 'ChevronDown'} size={14} className="text-muted-foreground" />
        </button>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="default"
            size="sm"
            iconName="ShoppingCart"
            className="flex-1"
            onClick={() => navigate('/deals')}
          >
            Adjust Supply Order
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            className="flex-1"
            onClick={() => navigate('/vendor-exchange')}
          >
            Pre-list Surplus
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MausamEngineCard;
