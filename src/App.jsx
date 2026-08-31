import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Loader2, AlertCircle, ShoppingCart, Sparkles } from 'lucide-react';
import { useCart } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import SearchBar from './components/SearchBar';

function App() {
  const [products, setProducts] = useState([]);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { addToCart, totalItems, totalAmount } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to connect to backend server at http://localhost:5000');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Callback passed to SearchBar to update state with API results
  const handleSearchResults = ({ products: filteredProducts, explanation }) => {
    setProducts(filteredProducts);
    setAiExplanation(explanation);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShoppingBag size={32} color="#2563eb" />
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>SmartCommerce Storefront</h1>
        </div>

        <div
          onClick={() => setIsCartOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#eff6ff', padding: '8px 16px', borderRadius: '20px', border: '1px solid #bfdbfe', cursor: 'pointer' }}
        >
          <ShoppingCart size={20} color="#2563eb" />
          <span style={{ fontWeight: 'bold', color: '#1e40af' }}>{totalItems} Items</span>
          <span style={{ color: '#3b82f6' }}>|</span>
          <span style={{ fontWeight: 'bold', color: '#1e40af' }}>₹{totalAmount}</span>
        </div>
      </header>

      {/* Slide-out Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Search Input Component */}
      <SearchBar onSearchResults={handleSearchResults} />

      {/* AI Explanation Banner */}
      {aiExplanation && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
          <Sparkles size={20} color="#16a34a" />
          <span style={{ fontSize: '0.95rem' }}>{aiExplanation}</span>
        </div>
      )}

      {/* Loading & Error States */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Fetching products from backend...</span>
        </div>
      )}

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Product List */}
      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {products.map((product) => (
            <div key={product.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#2563eb', fontWeight: 'bold' }}>{product.category}</span>
              <h3 style={{ margin: '8px 0', fontSize: '1.2rem' }}>{product.name}</h3>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '16px' }}>{product.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.25rem' }}>₹{product.price}</strong>
                <button
                  onClick={() => addToCart(product)}
                  style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;