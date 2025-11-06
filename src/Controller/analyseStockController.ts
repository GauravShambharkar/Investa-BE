import type { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { error } from "console";
import chalk from "chalk";
import { StockTypesAndRisks } from "../Config/StockType&Risk.js";
import { InvestmentStatusCriteria } from "../Config/InvestmentStatusCriteria.js";
import { StockInvestmentChecklist } from "../Config/Investmentchecklist.js";

export async function analyseStock(req: Request, res: Response) {
  const { stock } = req.params;

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return console.error(chalk.bgRed("gemini api is missing"));
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const aiResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Act like you are an expert finacial investment advisor, do market analysis about this stock ${stock}, here is market analysis ${StockInvestmentChecklist}  
      based on market analysis provide equivalant option whether to into ${stock} or not, the response should only include specifc match of stock type and risk of the stock ${StockTypesAndRisks} 
      and investment status criteria ${InvestmentStatusCriteria} about the ${stock}`,
  });

  if (!aiResponse) {
    console.log(chalk.bgRed("had error while generating reponse"));
    return res.send({
      ok: false,
      errMsg: "had error while generating reponse",
    });
  }

  res.send({
    ok: true,
    msg: aiResponse.text?.split(/\n\n|\n/).toString(),
  });
}
