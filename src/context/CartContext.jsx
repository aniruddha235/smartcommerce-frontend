import { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Add item or increment quantity if already present
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Remove specific item from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Adjust item quantity (+1 or -1)
  const updateQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Clear all cart items
  const clearCart = () => setCart([]);

  // Memoized total item count
  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // Memoized total cart amount
  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom Hook to consume cart context in any component
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};