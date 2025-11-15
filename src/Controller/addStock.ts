import type { Request, Response } from "express";
import { userModel } from "../Model/Models.js";

export async function addNewStocks(req: Request, res: Response) {
  const { email, name, price } = req.body;

  if (!email || !name || !price) {
    return res.status(400).send({
      ok: false,
      errMsg: "Email, name, price are required field",
    });
  }

  try {
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
        errMsg: "Had issue while adding new stock, Check Email first!!",
      });
    }

    res.send({
      ok: true,
      msg: "new stock has added to the databse",
      stock: newStock.stocks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      ok: false,
      errMsg: error,
    });
  }
}
