import React, { useState } from 'react';
import axios from 'axios';
import { Search, Sparkles, Loader2 } from 'lucide-react';

export default function SearchBar({ onSearchResults }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Durable laptop bag for rainy commutes",
    "Drop protection case",
    "Cold drinks bottle under ₹1000"
  ];

  const handleSearch = async (searchQuery) => {
    const targetQuery = searchQuery !== undefined ? searchQuery : query;
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/search', {
        query: targetQuery
      });
      // Pass { explanation, products } object to parent component
      onSearchResults(response.data);
    } catch (error) {
      console.error('AI search request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleChipClick = (promptText) => {
    setQuery(promptText);
    handleSearch(promptText);
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Search Bar Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder="Ask AI (e.g., 'Find a waterproof backpack for laptop')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 40px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.95rem',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
          <Sparkles size={18} color="#2563eb" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            padding: '0 20px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={18} />}
          Search
        </button>
      </form>

      {/* Suggested Search Chips */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Try asking:</span>
        {quickPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => handleChipClick(prompt)}
            style={{
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '4px 12px',
              fontSize: '0.8rem',
              color: '#475569',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}