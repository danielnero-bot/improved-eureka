import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("quickplate_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("quickplate_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, restaurant) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex > -1) {
        // Item exists, increase quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        // New item, add to cart
        return [
          ...prevItems,
          {
            ...item,
            quantity: 1,
            restaurant: {
              id: restaurant.id,
              name: restaurant.name,
              logo_url: restaurant.logo_url,
            },
          },
        ];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getRestaurantFromCart = () => {
    return cartItems.length > 0 ? cartItems[0].restaurant : null;
  };

  // Return an array of grouped items by restaurant
  const getGroupedCart = () => {
    const map = new Map();
    cartItems.forEach((item) => {
      const rid = item.restaurant?.id || "__unknown__";
      if (!map.has(rid)) {
        map.set(rid, {
          restaurant: item.restaurant || null,
          items: [],
        });
      }
      map.get(rid).items.push(item);
    });

    return Array.from(map.values()).map((group) => ({
      restaurant: group.restaurant,
      items: group.items,
      total: group.items.reduce((sum, it) => sum + Number(it.price) * it.quantity, 0),
    }));
  };

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getRestaurantFromCart,
    getGroupedCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
