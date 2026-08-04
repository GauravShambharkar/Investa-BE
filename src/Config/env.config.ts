import { z } from "zod";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiDir = path.resolve(__dirname, "../..");

// 1. In production, load .env.production / config.env if available
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: path.resolve(apiDir, ".env.production") });
  dotenv.config({ path: path.resolve(apiDir, "config.env") });
  dotenv.config({ path: path.resolve(apiDir, ".env") });
} else {
  // 2. Otherwise load config.env (takes precedence), .env.local, and .env
  dotenv.config({ path: path.resolve(apiDir, "config.env") });
  dotenv.config({ path: path.resolve(apiDir, ".env.local") });
  dotenv.config({ path: path.resolve(apiDir, ".env") });
}

const envSchema = z.object({
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  GEMINI_API_KEY: z.string().optional(),
  TWELVE_DATA_API_KEY: z.string().optional(),
  NEWS_API_KEY: z.string().optional(),
  API_VERSION: z.string().default("/investa/v1"),
  CLIENT_URL: z.string().optional(),
  LOCAL_CLIENT_URL: z.string().optional(),
  SERVER_HEALTH: z.string().default("/health"),
  ANALYSE_STOCK_ENDPOINT: z.string().default("/analyse/:stock"),
  CREATE_USER_ENDPOINT: z.string().default("/createUser"),
  ADD_NEW_STOCK_ENDPOINT: z.string().default("/addStock"),
  INVESTED_STOCK_ENDPOINT: z.string().default("/investedStock/:email"),
  FETCH_STOCKS_ENDPOINT: z.string().default("/stocks/ltp"),
});

export const env = envSchema.parse(process.env);

export const PORT = env.PORT;
export const NODE_ENV = env.NODE_ENV;
export const DATABASE_URL = env.DATABASE_URL || "";
export const GEMINI_API_KEY =
  env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
export const TWELVE_DATA_API_KEY =
  env.TWELVE_DATA_API_KEY || process.env.TWELVE_DATA_API_KEY || "";
export const NEWS_API_KEY =
  env.NEWS_API_KEY || process.env.NEWS_API_KEY || "";
export const API_VERSION = env.API_VERSION;

// Conditional logic for Production & Localhost URLs strictly from env files
export const IS_PRODUCTION = env.NODE_ENV === "production";
export const CLIENT_URL = env.CLIENT_URL || process.env.CLIENT_URL || "";
export const LOCAL_CLIENT_URL =
  env.LOCAL_CLIENT_URL || process.env.LOCAL_CLIENT_URL || "";

export const ALLOWED_ORIGINS = [CLIENT_URL, LOCAL_CLIENT_URL].filter(
  Boolean,
) as string[];
