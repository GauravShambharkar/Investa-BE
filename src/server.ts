import express from "express";
import mongoose from "mongoose";
import chalk from "chalk";
import helmet from "helmet";
import cors from "cors";
import { apiRoute } from "./Routes/Route.js";
import {
  PORT,
  DATABASE_URL,
  API_VERSION,
  ALLOWED_ORIGINS,
} from "./Config/env.config.js";

const investa = express();

investa.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (
        ALLOWED_ORIGINS.includes(origin) ||
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
  if (!DATABASE_URL) {
    console.error(chalk.red("DATABASE_URL is missing from environment config"));
    return;
  }

  await mongoose
    .connect(DATABASE_URL)
    .then(() => console.log(chalk.green("Connected To MongoDB!")))
    .catch((err) =>
      console.error(chalk.red("MongoDB connection failed:"), err)
    );
})();

investa.use(`${API_VERSION}`, apiRoute);

investa.listen(PORT, () => {
  console.log(chalk.blue(`Server running on port ${PORT}`));
});
