import { fetchData } from '../utils/apiHelpers';

const NEWS_API_URL = 'https://newsapi.org/v2/everything';
const NEWS_DATA_URL = 'https://newsdata.io/api/1/news';

export const newsService = {
  /**
   * Fetch space and tech news articles.
   * Handles both NewsAPI.org and NewsData.io (detects by key prefix).
   * @returns {Promise<Array>} - Combined list of news articles.
   */
  async fetchNews() {
    const key = import.meta.env.VITE_NEWS_API_KEY;

    if (!key || key === 'your_news_api_key') {
      console.warn('VITE_NEWS_API_KEY is not set or using default. Returning empty news.');
      return [];
    }

    // Detect key type: NewsData.io keys start with "pub_"
    const isNewsData = key.startsWith('pub_');

    try {
      if (isNewsData) {
        // NewsData.io Implementation
        const [spaceData, techData] = await Promise.all([
          fetchData(`${NEWS_DATA_URL}?apikey=${key}&q=space+NASA&language=en`),
          fetchData(`${NEWS_DATA_URL}?apikey=${key}&q=technology+AI&language=en`),
        ]);

        const spaceArticles = (spaceData.results || []).map(a => ({
          id: a.article_id,
          title: a.title,
          description: a.description,
          author: a.creator ? a.creator[0] : 'Staff Reporter',
          source: a.source_id,
          date: a.pubDate,
          url: a.link,
          category: 'space',
        }));

        const techArticles = (techData.results || []).map(a => ({
          id: a.article_id,
          title: a.title,
          description: a.description,
          author: a.creator ? a.creator[0] : 'Staff Reporter',
          source: a.source_id,
          date: a.pubDate,
          url: a.link,
          category: 'tech',
        }));

        return [...spaceArticles, ...techArticles];
      } else {
        // NewsAPI.org Implementation
        const [spaceData, techData] = await Promise.all([
          fetchData(`${NEWS_API_URL}?q=space+NASA+spacex&pageSize=5&sortBy=publishedAt&apiKey=${key}`),
          fetchData(`${NEWS_API_URL}?q=technology+AI+innovation&pageSize=5&sortBy=publishedAt&apiKey=${key}`),
        ]);

        const spaceArticles = (spaceData.articles || []).map(a => ({
          id: a.url + a.publishedAt,
          title: a.title,
          description: a.description,
          author: a.author,
          source: a.source?.name,
          date: a.publishedAt,
          url: a.url,
          category: 'space',
        }));

        const techArticles = (techData.articles || []).map(a => ({
          id: a.url + a.publishedAt,
          title: a.title,
          description: a.description,
          author: a.author,
          source: a.source?.name,
          date: a.publishedAt,
          url: a.url,
          category: 'tech',
        }));

        return [...spaceArticles, ...techArticles];
      }
    } catch (error) {
      console.error('Error fetching news from service:', error);
      throw error;
    }
  },
};
