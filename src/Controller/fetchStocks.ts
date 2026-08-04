import axios from "axios";
import type { Request, Response } from "express";
import { TWELVE_DATA_API_KEY } from "../Config/env.config.js";

export const fetchStocks = async (req: Request, res: Response) => {
  try {
    const symbols = req.query.symbols as string;

    if (!symbols) {
      return res.status(400).json({ ok: false, error: "symbols parameter is required" });
    }

    const url = `https://api.twelvedata.com/time_series?symbol=${symbols}&interval=1day&outputsize=30&apikey=${TWELVE_DATA_API_KEY}`;

    const response = await axios.get(url);
    const data = response.data;

    const finalData: any[] = [];

    // CASE 1 — Multiple symbols → object with keys
    if (!data.meta) {
      Object.keys(data).forEach((key) => {
        const item = data[key];
        if (!item || item.status === "error") return;

        finalData.push({
          symbol: item.meta.symbol,
          name: item.meta.name,
          price: item.values[0].close,
          chart: item.values.map((v: any) => ({
            datetime: v.datetime,
            close: v.close,
          })),
        });
      });
    }

    // CASE 2 — Single symbol (meta exists at root)
    else {
      finalData.push({
        symbol: data.meta.symbol,
        name: data.meta.name,
        price: data.values[0].close,
        chart: data.values.map((v: any) => ({
          datetime: v.datetime,
          close: v.close,
        })),
      });
    }

    if (finalData.length === 0) {
      return res.status(500).send({
        ok: false,
        errMsg: "there is no data in response from the twelve data API",
      });
    }

    return res.json({
      ok: true,
      count: finalData.length,
      stocks: finalData,
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
