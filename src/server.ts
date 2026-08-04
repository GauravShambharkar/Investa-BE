import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import chalk from "chalk";
import helmet from "helmet";
import cors from "cors";
import { apiRoute } from "./Routes/Route.js";

dotenv.config();

const investa = express();

// Allowed Origins for CORS configuration
const allowedOrigins = [
  "https://investaai.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4000",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

investa.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy error: Origin not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

investa.use(express.json());
investa.use(helmet());

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

investa.use(`${process.env.API_VERSION || "/investa/v1"}`, apiRoute);

const PORT = process.env.PORT || 5000;

investa.listen(PORT, () => {
  console.log(chalk.blue(`Server running on port ${PORT}`));
});
