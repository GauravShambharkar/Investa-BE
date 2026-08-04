import axios from "axios";
import type { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const API_KEY =
  process.env.VITE_NEWS_API ||
  process.env.NEWS_API_KEY ||
  "4ff96fda4b7c418086d078bf65f6f077";

export const fetchNews = async (req: Request, res: Response) => {
  try {
    const q =
      (req.query.q as string) ||
      "stock market OR financial markets OR stocks OR economy";
    const sortBy = (req.query.sortBy as string) || "popularity";
    const pageSize = (req.query.pageSize as string) || "30";

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      q
    )}&sortBy=${sortBy}&pageSize=${pageSize}&language=en&apiKey=${API_KEY}`;

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
