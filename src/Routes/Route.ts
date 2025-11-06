import express from "express";
import dotenv from "dotenv";
dotenv.config();
const askAiRoute = express.Router();

askAiRoute.get(`${process.env.SERVER_HEALTH}`, (req, res) => {
  res.send({
    ok: true,
    msg: "server health is fine",
  });
});

askAiRoute.post(`${process.env.ANALYSE_STOCK_ENDPOINT}`, (req, res) => {
  const { stock } = req.params;
  res.send({
    ok: true,
    msg: `this route wll process market analysis of ${stock}`,
  });
});

export { askAiRoute };
