// useNewsData — stub for Phase 1 (real API in Phase 2)
import { useState, useCallback } from 'react';

const CACHE_KEY = 'space_dashboard_news';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts < CACHE_TTL) return data;
    localStorage.removeItem(CACHE_KEY);
  } catch {
    localStorage.removeItem(CACHE_KEY);
  }
  return null;
}

function setCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* storage full */ }
}

export function useNewsData() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNews = useCallback(async (force = false) => {
    if (!force) {
      const cached = getCached();
      if (cached) { setArticles(cached); return; }
    }

    setLoading(true);
    setError(null);
    const key = import.meta.env.VITE_NEWS_API_KEY;

    try {
      const [spaceRes, techRes] = await Promise.all([
        fetch(`https://newsapi.org/v2/everything?q=space+NASA+ISS&pageSize=5&sortBy=publishedAt&apiKey=${key}`),
        fetch(`https://newsapi.org/v2/everything?q=technology+AI+innovation&pageSize=5&sortBy=publishedAt&apiKey=${key}`),
      ]);
      if (!spaceRes.ok || !techRes.ok) throw new Error('News API error');

      const [spaceJson, techJson] = await Promise.all([spaceRes.json(), techRes.json()]);
      const spaceArticles = (spaceJson.articles || []).map(a => ({ ...a, category: 'space' }));
      const techArticles  = (techJson.articles  || []).map(a => ({ ...a, category: 'tech' }));
      const all = [...spaceArticles, ...techArticles];

      setCache(all);
      setArticles(all);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { articles, loading, error, lastUpdated, fetchNews };
}
