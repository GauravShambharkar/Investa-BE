import express from "express";
import dotenv from "dotenv";
import { analyseStock } from "../Controller/analyseStockController.js";
import { investedStock } from "../Controller/investedStock.js";
import { createUser } from "../Controller/createUser.js";
import { addNewStocks } from "../Controller/addStock.js";
import { fetchStocks } from "../Controller/fetchStocks.js";
dotenv.config();
const apiRoute = express.Router();

apiRoute.get(`${process.env.SERVER_HEALTH}`, (req, res) => {
  res.send({
    ok: true,
    msg: "server health is fine",
  });
});

// fetching users invested stocks
apiRoute.get(`${process.env.INVESTED_STOCK_ENDPOINT}`, investedStock);

// creating user
apiRoute.post(`${process.env.CREATE_USER_ENDPOINT}`, createUser);

// add stock
apiRoute.post(`${process.env.ADD_NEW_STOCK_ENDPOINT}`, addNewStocks);

// stock analysis
apiRoute.post(`${process.env.ANALYSE_STOCK_ENDPOINT}`, analyseStock);

// get the stock price
apiRoute.get(`${process.env.FETCH_STOCKS_ENDPOINT}`, fetchStocks);

export { apiRoute };
