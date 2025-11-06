import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
import chalk from "chalk";
import helmet from "helmet";
import { askAiRoute } from "./Routes/Route.js";
const investa = express().use(express.json(), helmet());

(async () => {
  if (!process.env.DATABASE_URL) {
    return new Error("DATABASE_URL is missing");
  }
  
  await mongoose
  .connect(process.env.DATABASE_URL!)
  .then(() => console.log(chalk.green("Connected To MongoDB!")))
  .catch((err) =>
    console.error(chalk.red("MongoDB connection failed:"), err)
);
})();



investa.use(`${process.env.API_VERSION}`, askAiRoute);

const PORT = process.env.PORT || 5000;

investa.listen(PORT, () => {
  console.log(chalk.blue(`Server running on port ${PORT}`));
  // get
  
});
