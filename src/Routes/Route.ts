import express from "express";
import dotenv from "dotenv";
import { analyseStock } from "../Controller/analyseStockController.js";
dotenv.config();
const askAiRoute = express.Router();

askAiRoute.get(`${process.env.SERVER_HEALTH}`, (req, res) => {
  res.send({
    ok: true,
    msg: "server health is fine",
  });
});

askAiRoute.post(`${process.env.ANALYSE_STOCK_ENDPOINT}`, analyseStock);

export { askAiRoute };
