import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
import helmet from "helmet";

const investa = express().use(express.json(), helmet());

(() => {
  if (!process.env.DATABASE_URL) {
    return new Error("DATABASE_URL is missing from ");
  }
  mongoose.connect(process.env.DATABASE_URL);
})();

investa.use("/investa/v1/readStocks", (req, res) => {
  res.send({
    message: "Welcome to Investa API v1 - Read Stocks Endpoint",
  });
});

const PORT = process.env.PORT || 5000;

investa.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
