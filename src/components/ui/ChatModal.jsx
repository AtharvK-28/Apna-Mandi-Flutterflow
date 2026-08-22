import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const ChatModal = ({ isOpen, onClose, supplier, orderId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Inline confirmation for an attached file, instead of a blocking alert().
  const [notice, setNotice] = useState(null);
  const messagesEndRef = useRef(null);

  // Mock initial messages
  useEffect(() => {
    if (isOpen && supplier) {
      setMessages([
        {
          id: 1,
          sender: 'supplier',
          text: `Hi! I'm ${supplier.supplierName}. How can I help you with your order #${orderId}?`,
          timestamp: new Date(Date.now() - 300000).toISOString(),
          isRead: true
        },
        {
          id: 2,
          sender: 'vendor',
          text: 'Hi! I wanted to check the delivery status of my order.',
          timestamp: new Date(Date.now() - 240000).toISOString(),
          isRead: true
        },
        {
          id: 3,
          sender: 'supplier',
          text: 'Your order is being prepared and will be out for delivery within the next 30 minutes.',
          timestamp: new Date(Date.now() - 180000).toISOString(),
          isRead: true
        }
      ]);
    }
  }, [isOpen, supplier, orderId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const vendorMessage = {
      id: messages.length + 1,
      sender: 'vendor',
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, vendorMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate supplier response
    setTimeout(() => {
      const supplierResponse = {
        id: messages.length + 2,
        sender: 'supplier',
        text: getMockResponse(newMessage.trim()),
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setMessages(prev => [...prev, supplierResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const getMockResponse = (message) => {
    const responses = [
      'Thank you for your message. I\'ll check on that right away.',
      'I understand your concern. Let me look into this for you.',
      'Your order is progressing well. I\'ll keep you updated.',
      'I\'ll make sure to prioritize your order. Thank you for your patience.',
      'That\'s a great question. Let me get you the details.',
      'I appreciate your business. Is there anything else I can help with?'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isOpen || !supplier) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Store" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">
                {supplier?.supplierName || 'Supplier'}
              </h3>
              <p className="text-xs text-muted-foreground">
                Order #{orderId || 'Unknown'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'vendor' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.sender === 'vendor'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-card-foreground'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'vendor' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted text-card-foreground rounded-lg px-3 py-2">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">Typing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border flex justify-center">
          <div className="flex items-center space-x-2 w-full max-w-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('file-upload').click()}
              className="flex-shrink-0"
            >
              <Icon name="Image" size={16} />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              variant="default"
              size="sm"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="flex-shrink-0"
            >
              <Icon name="Send" size={16} />
            </Button>
          </div>
          {notice && (
            <p className="text-xs text-ink-medium mt-2 flex items-center gap-1.5">
              <Icon name="Paperclip" size={12} />
              {notice}
            </p>
          )}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setNotice(`"${file.name}" attached.`);
                e.target.value = ''; // Reset input
              }
            }}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatModal; 