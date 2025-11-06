import type { Request, Response } from "express";
import { userModel } from "../Model/Models.js";

export async function addStocks(req: Request, res: Response) {
  const { email, name, price } = req.body;

  const newStock = await userModel.findOneAndUpdate(
    { email },
    {
      $push: {
        stocks: {
          $each: [
            {
              name: name,
              price: price,
            },
          ],
          $position: 0,
        },
      },
    }
  );

  if (!newStock) {
    return res.status(500).send({
      ok: false,
      errMsg: "server had issue while adding new stock",
    });
  }

  res.send({
    ok: true,
    msg: "new stock has added to the databse",
    stock: newStock.stocks,
  });
}
