import axios from "axios";
import type { Request, Response } from "express";

export const getStockChart = async (req: Request, res: Response) => {
  const { instrument_key, interval } = req.body;

  try {
    const response = await axios.get(
      "https://api.upstox.com/v2/historical-candle",
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTOCK_ACCESS_TOKEN}`,
        },
        params: {
          instrument_key,
          interval,
          to_date: new Date().toISOString(),
          from_date: "2024-01-01", // or dynamic
        },
      }
    );

    res.send({
      data: response.data,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};
