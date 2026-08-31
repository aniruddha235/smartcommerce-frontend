import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Helper function to dynamically inject Razorpay SDK script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();

  if (!isOpen) return null;

  const handleCheckout = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Failed to load Razorpay SDK. Please check your internet connection.');
      return;
    }

    // Razorpay modal configuration (uses test mode default key)
    const options = {
      key: 'rzp_test_1234567890abcdef', // Replace with your real Razorpay Test Key if available
      amount: totalAmount * 100, // Amount must be passed in smallest currency sub-unit (paise)
      currency: 'INR',
      name: 'SmartCommerce AI Store',
      description: 'Order Payment Checkout',
      handler: function (response) {
        alert(`Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`);
        clearCart();
        onClose();
      },
      prefill: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#2563eb',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          height: '100%',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 16px rgba(0,0,0,0.15)',
          padding: '20px',
          boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#2563eb" /> Your Cart
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={22} color="#6b7280" />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '40px' }}>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>{item.name}</h4>
                  <span style={{ color: '#4b5563', fontSize: '0.85rem' }}>₹{item.price} × {item.quantity}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '4px' }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>
                      <Minus size={12} />
                    </button>
                    <span style={{ padding: '0 6px', fontSize: '0.85rem' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <span>Total:</span>
              <span>₹{totalAmount}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={clearCart} style={{ flex: 1, backgroundColor: '#f3f4f6', color: '#374151', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                Clear
              </button>
              <button
                onClick={handleCheckout}
                style={{
                  flex: 2,
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <CreditCard size={18} />
                Pay via Razorpay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}