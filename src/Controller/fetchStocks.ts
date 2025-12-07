import axios from "axios";
import type { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.TWELVE_DATA_API_KEY

export const fetchStocks = async (req: Request, res: Response) => {
  try {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let nseSymbols: string[] = [];

    // STEP 1 — Fetch NSE symbols A-Z
    for (const letter of alphabet) {
      const searchRes = await axios.get(
        `https://api.twelvedata.com/symbol_search?symbol=${letter}&apikey=${API_KEY}`
      );

      const filtered = searchRes.data.data?.filter(
        (s: any) => s.exchange === "NSE"
      );

      if (filtered) {
        filtered.forEach((item: any) => nseSymbols.push(item.symbol));
      }
    }

    // Remove duplicates
    nseSymbols = [...new Set(nseSymbols)];

    // STEP 2 — Batch into chunks (Twelve Data supports large batches)
    const chunkSize = 40;
    const chunks: string[][] = [];

    for (let i = 0; i < nseSymbols.length; i += chunkSize) {
      chunks.push(nseSymbols.slice(i, i + chunkSize));
    }

    let finalData: any[] = [];

    // STEP 3 — Fetch /quote for each batch
    for (const chunk of chunks) {
      const symbolString = chunk.join(",");

      const quoteRes = await axios.get(
        `https://api.twelvedata.com/quote?symbol=${symbolString}&apikey=${API_KEY}`
      );

      const data = quoteRes.data;

      // Format properly (Twelve Data returns object keyed by symbol)
      Object.keys(data).forEach((key) => {
        const st = data[key];

        // skip if bad response
        if (!st || st.code === 400 || st.status === "error") return;

        finalData.push({
          symbol: st.symbol,
          name: st.name,
          price: st.close,
          currency: st.currency,
        });
      });
    }

    return res.json({
      ok: true,
      count: finalData.length,
      stocks: finalData,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
