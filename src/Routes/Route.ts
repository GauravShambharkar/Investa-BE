import express from "express";
import dotenv from "dotenv";
import { analyseStock } from "../Controller/analyseStockController.js";
import { investedStock } from "../Controller/investedStock.js";
import { createUser } from "../Controller/createUser.js";
dotenv.config();
const askAiRoute = express.Router();

askAiRoute.get(`${process.env.SERVER_HEALTH}`, (req, res) => {
  res.send({
    ok: true,
    msg: "server health is fine",
  });
});

askAiRoute.get(`${process.env.INVESTED_STOCK_ENDPOINT}`, investedStock);
askAiRoute.post(`${process.env.CREATE_USER_ENDPOINT}`, createUser);
askAiRoute.post(`${process.env.ANALYSE_STOCK_ENDPOINT}`, analyseStock);

export { askAiRoute };
