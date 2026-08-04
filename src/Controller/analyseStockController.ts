import type { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import chalk from "chalk";
import { StockTypesAndRisks } from "../Config/StockType&Risk.js";
import { InvestmentStatusCriteria } from "../Config/InvestmentStatusCriteria.js";
import { StockInvestmentChecklist } from "../Config/Investmentchecklist.js";
import { GEMINI_API_KEY } from "../Config/env.config.js";

export async function analyseStock(req: Request, res: Response) {
  const stock = req.params.stock || req.body?.stock;

  if (!GEMINI_API_KEY) {
    console.error(chalk.bgRed("gemini api key is missing"));
    return res.status(400).send({
      ok: false,
      errMsg: "gemini api key is missing from environment config",
    });
  }

  if (!stock) {
    console.log("stock name is required");
    return res.status(400).send({
      ok: false,
      errMsg: "stock name is required before analysing stocks",
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Act like you are an expert financial investment advisor, do market analysis about this stock ${stock}, here is market analysis ${JSON.stringify(
        StockInvestmentChecklist
      )}  
      based on market analysis provide equivalent option whether to invest into ${stock} or not, the response should only include specific match of stock type and risk of the stock ${JSON.stringify(
        StockTypesAndRisks
      )} 
      and investment status criteria ${JSON.stringify(
        InvestmentStatusCriteria
      )} about the ${stock}`,
    });

    if (!aiResponse) {
      console.log(chalk.bgRed("had error while generating AI response"));
      return res.status(500).send({
        ok: false,
        errMsg: "had error while generating AI response",
      });
    }

    res.send({
      ok: true,
      msg: aiResponse.text?.split(/\n\n|\n/).toString(),
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).send({
      ok: false,
      errMsg: error?.message || error,
    });
  }
}
