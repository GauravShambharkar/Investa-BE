import type { Request, Response } from "express";
import { userModel } from "../Model/Models.js";

export async function addNewStocks(req: Request, res: Response) {
  const { email, name, price } = req.body;

  const stockExists = await userModel.findOne({
    email,
    "stocks.name": name,
  });

  if (stockExists) {
    return res.status(300).send({
      ok: false,
      errMsg: `${name} already exists in the database`,
    });
  }

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
    },
    { new: true }
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
