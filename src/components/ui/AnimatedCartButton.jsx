import React, { useState, useRef } from 'react';
import Icon from '../AppIcon';
import './AnimatedCartButton.css';

const AnimatedCartButton = ({ 
  onComplete, 
  defaultText = "Add to cart", 
  successText = "Added", 
  disabled = false, 
  className = "" 
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const buttonRef = useRef(null);

  const handleClick = () => {
    if (disabled || isClicked) return;

    setIsClicked(true);
    
    // Call the completion callback after animation
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 1500);

    // Reset after animation completes
    setTimeout(() => {
      setIsClicked(false);
    }, 2000);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled || isClicked}
      className={`cart__button ${isClicked ? 'clicked' : ''} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40px',
        backgroundColor: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        border: 'none',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <span className="add__to-cart">{defaultText}</span>
      <span className="added">{successText}</span>
      <Icon name="ShoppingCart" className="fa-shopping-cart" />
      <Icon name="Package" className="fa-box" />
    </button>
  );
};

export default AnimatedCartButton; 