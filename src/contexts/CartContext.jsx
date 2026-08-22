import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart items from localStorage on initialization
    try {
      const saved = localStorage.getItem('apna-mandi-cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Validate and clean the loaded data
        const validCartItems = {};
        Object.entries(parsed).forEach(([id, item]) => {
          if (item && typeof item === 'object' && item.id) {
            validCartItems[id] = {
              ...item,
              price: parseFloat(item.price) || 0,
              originalPrice: parseFloat(item.originalPrice) || 0,
              quantity: parseFloat(item.quantity) || 0
            };
          }
        });
        
        return validCartItems;
      }
      return {};
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // Clear corrupted data
      try {
        localStorage.removeItem('apna-mandi-cart');
      } catch (e) {
        console.error('Error clearing corrupted localStorage:', e);
      }
      return {};
    }
  });
  const cartCount = Object.keys(cartItems).length;

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    try {
      // Validate cart data before saving
      const validCartItems = {};
      Object.entries(cartItems).forEach(([id, item]) => {
        if (item && typeof item === 'object' && item.id) {
          validCartItems[id] = {
            ...item,
            price: parseFloat(item.price) || 0,
            originalPrice: parseFloat(item.originalPrice) || 0,
            quantity: parseFloat(item.quantity) || 0
          };
        }
      });
      
      const dataToSave = JSON.stringify(validCartItems);
      localStorage.setItem('apna-mandi-cart', dataToSave);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (deal, quantity = 1) => {
    if (!deal || !deal.id) {
      return;
    }

    const cartItem = {
      id: deal.id,
      name: deal.name || 'Unknown Product',
      price: parseFloat(deal.price) || 0,
      originalPrice: parseFloat(deal.originalPrice) || 0,
      unit: deal.unit || 'unit',
      quantity: parseFloat(quantity) || 1,
      supplierName: deal.supplierName || 'Unknown Supplier',
      category: deal.category || 'Unknown',
      image: deal.image || null,
      dealType: deal.dealType || null
    };

    setCartItems(prev => {
      const newItems = {
        ...prev,
        [deal.id]: cartItem
      };
      return newItems;
    });
  };

  const updateQuantity = (dealId, quantity) => {
    const newQuantity = parseFloat(quantity) || 0;
    
    if (newQuantity <= 0) {
      setCartItems(prev => {
        const newItems = { ...prev };
        delete newItems[dealId];
        return newItems;
      });
    } else {
      setCartItems(prev => ({
        ...prev,
        [dealId]: {
          ...prev[dealId],
          quantity: newQuantity
        }
      }));
    }
  };

  const removeFromCart = (dealId) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      delete newItems[dealId];
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems({});
    // Also clear localStorage
    try {
      localStorage.removeItem('apna-mandi-cart');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  const resetCartData = () => {
    // Clear everything and reset
    setCartItems({});
    // setCartCount(0); // This line is no longer needed
    try {
      localStorage.removeItem('apna-mandi-cart');
    } catch (error) {
      console.error('Error resetting cart data:', error);
    }
  };

  const getCartItems = () => {
    return Object.values(cartItems);
  };

  const getCartTotal = () => {
    return Object.values(cartItems).reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);
  };

  const addTestItem = () => {
    const testDeal = {
      id: 'test-1',
      name: 'Test Tomatoes',
      price: 25,
      originalPrice: 35,
      unit: 'kg',
      supplierName: 'Test Supplier',
      category: 'vegetables',
      image: null,
      dealType: 'fresh-morning'
    };
    
    addToCart(testDeal, 2);
  };

  const value = {
    cartItems,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItems,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 