import { useEffect, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import GameGrid from '../components/GameGrid';
import Filters from '../components/Filters';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { useCatalog } from '../contexts/CatalogContext';

export default function Catalog() {
  const { 
    games, 
    loading, 
    totalResults, 
    filters, 
    updateFilter,
    searchGames 
  } = useCatalog();

  const [showFilters, setShowFilters] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const totalPages = Math.ceil(totalResults / filters.pageSize);

  const handlePageChange = (page) => {
    updateFilter('page', page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query) => {
    searchGames(query);
  };

  return (
    <MainLayout>
      <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: 'var(--space-4)'
          }}>
            Tienda de Juegos
          </h1>
          
          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-4)',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
          }}>
            {/* Search */}
            <div style={{ flex: '1', minWidth: '300px', maxWidth: '500px' }}>
              <SearchBar 
                placeholder="Buscar juegos, desarrolladores, géneros..."
                onSearch={handleSearch}
                showSuggestions={true}
              />
            </div>

            {/* Filter toggle */}
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="btn btn-secondary"
                style={{ display: 'none' }}
              >
                <Filter size={20} />
                Filtros
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                <Filter size={20} />
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && <Filters />}

        {/* Results info */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-6)',
          padding: 'var(--space-4) 0',
          borderBottom: '1px solid var(--border)'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {loading ? 'Cargando...' : `${totalResults} juegos encontrados`}
          </span>
          
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Página {filters.page} de {totalPages || 1}
          </span>
        </div>

        {/* Game Grid */}
        <GameGrid
          games={games}
          loading={loading}
          emptyMessage="No se encontraron juegos"
          emptyDescription="Intenta ajustar los filtros o buscar otros términos"
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Mobile filters modal */}
      {showMobileFilters && (
        <div className="modal-overlay" onClick={() => setShowMobileFilters(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Filtros</h2>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <Filters />
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @media (max-width: 768px) {
          button:has(.btn-secondary) {
            display: flex !important;
          }
          .filters {
            display: none;
          }
        }
      `}</style>
    </MainLayout>
  );
}