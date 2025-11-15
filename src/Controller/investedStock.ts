import type { Request, Response } from "express";
import chalk from "chalk";
import { userModel } from "../Model/Models.js";

// get method
export async function investedStock(req: Request, res: Response) {
  const { email } = req.params;

  if (!email) {
    console.log("required param not entered");
    return res.status(401).send({
      ok: false,
      errMsg: "Email in param is important",
    });
  }
  try {
    const stock = await userModel.findOne({ email });

    if (!stock) {
      return res.status(400).send({
        ok: false,
        errMsg: "couldnt find user",
      });
    }
    res.send({
      ok: true,
      msg: stock.stocks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      ok: false,
      errMsg: error,
    });
  }
}
