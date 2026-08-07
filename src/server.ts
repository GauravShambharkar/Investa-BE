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
import "./Config/firebase.config.js";
import "./Config/redis.config.js";

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

// Optional database connection (does not block server startup if missing/invalid)
if (DATABASE_URL && DATABASE_URL.trim() !== "") {
  mongoose
    .connect(DATABASE_URL)
    .then(() => console.log(chalk.green("Connected To MongoDB!")))
    .catch((err) =>
      console.warn(chalk.yellow("MongoDB connection warning (continuing without DB):"), err.message || err)
    );
} else {
  console.log(chalk.yellow("DATABASE_URL not set — running backend in stateless mode."));
}

investa.use(`${API_VERSION}`, apiRoute);

investa.listen(PORT, () => {
  console.log(chalk.blue(`Server running on port ${PORT}`));
});
