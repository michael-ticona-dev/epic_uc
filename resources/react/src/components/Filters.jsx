import { useCatalog } from '../contexts/CatalogContext';

export default function Filters() {
  const { 
    categories, 
    filters, 
    updateFilter, 
    resetFilters 
  } = useCatalog();

  const platforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo'];
  const sortOptions = [
    { value: 'relevance', label: 'Relevancia' },
    { value: 'name', label: 'Nombre' },
    { value: 'price-low', label: 'Precio: Menor a Mayor' },
    { value: 'price-high', label: 'Precio: Mayor a Menor' },
    { value: 'rating', label: 'Valoración' },
    { value: 'release-date', label: 'Fecha de Lanzamiento' }
  ];

  return (
    <div className="filters">
      <div className="filter-group">
        <label className="filter-label">Categoría</label>
        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Plataforma</label>
        <select
          className="filter-select"
          value={filters.platform}
          onChange={(e) => updateFilter('platform', e.target.value)}
        >
          <option value="">Todas las plataformas</option>
          {platforms.map(platform => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Precio máximo</label>
        <input
          type="range"
          min="0"
          max="100"
          value={filters.priceRange[1]}
          onChange={(e) => updateFilter('priceRange', [0, parseInt(e.target.value)])}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: 'var(--radius)',
            background: 'var(--surface-2)',
            outline: 'none'
          }}
        />
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Hasta €{filters.priceRange[1]}
        </span>
      </div>

      <div className="filter-group">
        <label className="filter-label">Valoración mínima</label>
        <select
          className="filter-select"
          value={filters.rating}
          onChange={(e) => updateFilter('rating', parseFloat(e.target.value))}
        >
          <option value="0">Cualquier valoración</option>
          <option value="4">4+ estrellas</option>
          <option value="4.5">4.5+ estrellas</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Ordenar por</label>
        <select
          className="filter-select"
          value={filters.sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={resetFilters}
        className="btn btn-ghost btn-sm"
        style={{ alignSelf: 'flex-end' }}
      >
        Limpiar Filtros
      </button>
    </div>
  );
}