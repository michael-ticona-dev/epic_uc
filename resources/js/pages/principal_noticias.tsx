import { useEffect, useState } from 'react';
import { ExternalLink, Calendar, Newspaper } from 'lucide-react';
import '../styles/principal_noticias.css';

interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

export function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<string>('all');

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/news`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredArticles = selectedSource === 'all'
    ? articles
    : articles.filter(a => a.source.toLowerCase().includes(selectedSource.toLowerCase()));

  const sources = ['all', ...Array.from(new Set(articles.map(a => a.source)))];

  if (loading) {
    return (
      <div className="news-page">
        <div className="container">
          <div className="loading">Cargando noticias...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="container">
        <div className="news-header">
          <div className="news-header-content">
            <Newspaper size={48} className="news-icon" />
            <div>
              <h1 className="news-title">Noticias de Gaming</h1>
              <p className="news-subtitle">Las últimas novedades del mundo de los videojuegos</p>
            </div>
          </div>
        </div>

        <div className="news-filters">
          <div className="filter-label">Filtrar por fuente:</div>
          <div className="source-filters">
            {sources.map((source) => (
              <button
                key={source}
                onClick={() => setSelectedSource(source)}
                className={selectedSource === source ? 'source-btn active' : 'source-btn'}
              >
                {source === 'all' ? 'Todas' : source}
              </button>
            ))}
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="empty-state">
            <p>No hay noticias disponibles en este momento.</p>
          </div>
        ) : (
          <div className="news-grid">
            {filteredArticles.map((article, index) => (
              <article key={index} className="news-card">
                {article.imageUrl && (
                  <div className="news-card-image-wrapper">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="news-card-image"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="news-card-content">
                  <div className="news-card-meta">
                    <span className="news-card-source">{article.source}</span>
                    <div className="news-card-date">
                      <Calendar size={14} />
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <h3 className="news-card-title">{article.title}</h3>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-card-link"
                  >
                    Leer más
                    <ExternalLink size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
