import type { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { error } from "console";
import chalk from "chalk";

export async function analyseStock(req: Request, res: Response) {
  const { stock } = req.params;

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return console.error(chalk.bgRed("gemini api is missing"));
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const aiResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `What is market price of ${stock} in ${new Date()}`,
  });

  if (!aiResponse) {
    console.log(chalk.bgRed("had error while generating reponse"));
    return res.send({
      ok: false,
      errMsg: `had error while processing ${stock} response`,
    });
  }

  res.send({
    ok: true,
    msg: aiResponse.text?.split(/\n\n|\n/).toString(),
  });
}
