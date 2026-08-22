import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../contexts/ToastContext';

const NotificationPanel = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const toast = useToast();
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'All', icon: 'Bell' },
    { value: 'orders', label: 'Orders', icon: 'ShoppingBag' },
    { value: 'inventory', label: 'Inventory', icon: 'Package' },
    { value: 'messages', label: 'Messages', icon: 'MessageCircle' }
  ];

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleViewAllNotifications = () => {
    toast.info('You are seeing every notification from the last 7 days.');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'orders': return 'ShoppingBag';
      case 'inventory': return 'Package';
      case 'messages': return 'MessageCircle';
      case 'payment': return 'CreditCard';
      case 'delivery': return 'Truck';
      default: return 'Bell';
    }
  };

  const getNotificationIconBg = (type) => {
    switch (type) {
      case 'orders': return 'bg-primary/10';
      case 'inventory': return 'bg-warning/10';
      case 'messages': return 'bg-accent/10';
      case 'payment': return 'bg-success/10';
      default: return 'bg-muted/10';
    }
  };

  const getNotificationIconColor = (type) => {
    switch (type) {
      case 'orders': return 'text-primary';
      case 'inventory': return 'text-warning';
      case 'messages': return 'text-accent';
      case 'payment': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-card-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <div className="bg-secondary text-secondary-foreground text-xs font-medium rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-2">
                {unreadCount}
              </div>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
              <Icon name="CheckCheck" size={16} className="mr-2" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-muted/30 rounded-lg p-1">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex-1 justify-center ${
                filter === option.value
                  ? 'bg-card text-card-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={option.icon} size={14} />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Icon name="Bell" size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {displayedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-muted/30 transition-colors duration-200 ${
                  !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full bg-muted ${getNotificationIconBg(notification.type)}`}>
                    <Icon name={getNotificationIcon(notification.type)} size={16} className={getNotificationIconColor(notification.type)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          !notification.read ? 'text-card-foreground' : 'text-muted-foreground'
                        }`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-3 mt-2">
                          <p className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </p>
                          {notification.priority === 'high' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
                              <Icon name="AlertCircle" size={10} className="mr-1" />
                              High Priority
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.read && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="p-1 hover:bg-muted rounded-full transition-colors duration-200"
                            title="Mark as read"
                          >
                            <Icon name="Check" size={14} className="text-muted-foreground" />
                          </button>
                        )}
                        <button
                          className="p-1 hover:bg-muted rounded-full transition-colors duration-200"
                          title="More options"
                        >
                          <Icon name="MoreHorizontal" size={14} className="text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full absolute left-2 top-6" />
                    )}
                  </div>
                </div>

                {/* Action Buttons for specific notification types */}
                {notification.type === 'orders' && notification.actionRequired && (
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" variant="outline">
                      View Order
                    </Button>
                    <Button size="sm">
                      Confirm
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 5 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <Button variant="outline" size="sm" className="w-full" onClick={handleViewAllNotifications}>
            <Icon name="ExternalLink" size={16} className="mr-2" />
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;