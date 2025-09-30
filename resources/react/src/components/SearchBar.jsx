import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useCatalog } from '../contexts/CatalogContext';

export default function SearchBar({ 
  placeholder = "Buscar juegos...", 
  onSearch,
  showSuggestions = false 
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const { games } = useCatalog();
  const searchRef = useRef(null);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestionsList(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generar sugerencias basadas en la búsqueda
  useEffect(() => {
    if (query.length > 1 && showSuggestions) {
      const filtered = games
        .filter(game =>
          game.title.toLowerCase().includes(query.toLowerCase()) ||
          game.developer.toLowerCase().includes(query.toLowerCase()) ||
          game.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 5);
      
      setSuggestions(filtered);
      setShowSuggestionsList(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestionsList(false);
    }
  }, [query, games, showSuggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
      setShowSuggestionsList(false);
    }
  };

  const handleSuggestionClick = (game) => {
    setQuery(game.title);
    setShowSuggestionsList(false);
    if (onSearch) {
      onSearch(game.title);
    }
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestionsList(true);
            }
          }}
        />
      </form>

      {showSuggestionsList && (
        <div className="search-suggestions">
          {suggestions.map((game) => (
            <div
              key={game.id}
              className="search-suggestion"
              onClick={() => handleSuggestionClick(game)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <img
                  src={game.cover}
                  alt={game.title}
                  style={{
                    width: '32px',
                    height: '24px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)'
                  }}
                />
                <div>
                  <div style={{ fontWeight: '500' }}>{game.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {game.developer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}