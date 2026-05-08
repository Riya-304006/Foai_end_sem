import { useState, useEffect, useCallback, useMemo } from 'react';
import { newsService } from '../services/newsService';
import { storage } from '../utils/storage';

const CACHE_KEY = 'space_dashboard_news';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

/**
 * Hook to manage news articles, searching, sorting, and caching.
 * @returns {Object} { articles, filteredArticles, loading, error, lastUpdated, search, setSearch, sortBy, setSortBy, refresh }
 */
export function useNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'source'

  const fetchNews = useCallback(async (force = false) => {
    if (!force) {
      const cached = storage.getWithExpiry(CACHE_KEY);
      if (cached) {
        setArticles(cached);
        setLastUpdated(new Date()); // Best guess for cached data
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const data = await newsService.fetchNews();
      setArticles(data);
      setLastUpdated(new Date());
      storage.setWithExpiry(CACHE_KEY, data, CACHE_TTL);
    } catch (err) {
      setError(err.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const filteredArticles = useMemo(() => {
    let result = articles.filter(article => 
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.description?.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date));
    } else if (sortBy === 'source') {
      result.sort((a, b) => {
        const sourceA = typeof a.source === 'string' ? a.source : a.source?.name || '';
        const sourceB = typeof b.source === 'string' ? b.source : b.source?.name || '';
        return sourceA.localeCompare(sourceB);
      });
    }

    return result;
  }, [articles, search, sortBy]);

  return {
    articles,
    filteredArticles,
    loading,
    error,
    lastUpdated,
    search,
    setSearch,
    sortBy,
    setSortBy,
    refresh: () => fetchNews(true)
  };
}
