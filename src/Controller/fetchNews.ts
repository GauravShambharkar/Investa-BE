import axios from "axios";
import type { Request, Response } from "express";
import { NEWS_API_KEY, REDIS_CACHE_TTL } from "../Config/env.config.js";
import { getCache, setCache } from "../Config/redis.config.js";

export const fetchNews = async (req: Request, res: Response) => {
  try {
    const q =
      (req.query.q as string) ||
      "stock market OR financial markets OR stocks OR economy";
    const sortBy = (req.query.sortBy as string) || "popularity";
    const pageSize = (req.query.pageSize as string) || "30";

    const apiKey = NEWS_API_KEY || process.env.NEWS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        ok: false,
        error: "NEWS_API_KEY environment variable is not configured on Render.",
        articles: [],
      });
    }

    // 1. Construct unique Redis cache key based on query parameters
    const cacheKey = `news:${q.trim().toLowerCase()}:${sortBy}:${pageSize}`;

    // 2. Check Redis cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      try {
        const parsedArticles = JSON.parse(cachedData);
        if (Array.isArray(parsedArticles) && parsedArticles.length > 0) {
          console.log(`⚡ [Redis Cache HIT] Serving ${parsedArticles.length} news articles from Redis for key: "${cacheKey}"`);
          return res.json({
            ok: true,
            source: "redis_cache",
            count: parsedArticles.length,
            articles: parsedArticles,
          });
        }
      } catch (parseErr) {
        // Fallback to live API if cache parse fails
      }
    }

    // 3. Cache Miss: Fetch live news from NewsAPI
    console.log(`📡 [Redis Cache MISS] Fetching live news articles from NewsAPI for key: "${cacheKey}"`);
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      q
    )}&sortBy=${sortBy}&pageSize=${pageSize}&language=en&apiKey=${apiKey}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "InvestaBackend/1.0",
      },
    });

    const articles = response.data.articles || [];
    const validArticles = articles.filter(
      (art: any) => art.title && art.title !== "[Removed]" && art.url
    );

    // 4. Save fetched response into Redis cache with TTL (15 mins default)
    if (validArticles.length > 0) {
      await setCache(cacheKey, JSON.stringify(validArticles), REDIS_CACHE_TTL);
    }

    return res.json({
      ok: true,
      source: "live_api",
      count: validArticles.length,
      articles: validArticles,
    });
  } catch (err: any) {
    console.error("Backend fetchNews error:", err?.response?.data || err.message);
    return res.status(500).json({
      ok: false,
      error: err?.response?.data?.message || err.message,
      articles: [],
    });
  }
};
