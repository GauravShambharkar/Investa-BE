import axios from "axios";
import type { Request, Response } from "express";
import { NEWS_API_KEY } from "../Config/env.config.js";

export const fetchNews = async (req: Request, res: Response) => {
  try {
    const q =
      (req.query.q as string) ||
      "stock market OR financial markets OR stocks OR economy";
    const sortBy = (req.query.sortBy as string) || "popularity";
    const pageSize = (req.query.pageSize as string) || "30";

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      q
    )}&sortBy=${sortBy}&pageSize=${pageSize}&language=en&apiKey=${NEWS_API_KEY}`;

    const response = await axios.get(url);
    const articles = response.data.articles || [];

    const validArticles = articles.filter(
      (art: any) => art.title && art.title !== "[Removed]" && art.url
    );

    return res.json({
      ok: true,
      count: validArticles.length,
      articles: validArticles,
    });
  } catch (err: any) {
    console.error(
      "Backend fetchNews error:",
      err?.response?.data || err.message
    );
    return res.status(500).json({
      ok: false,
      error: err?.response?.data?.message || err.message,
      articles: [],
    });
  }
};
