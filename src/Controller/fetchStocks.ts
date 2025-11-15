import axios from "axios";
import { type Request, type Response } from "express";

export const fetchStocks = async (req: Request, res: Response) => {
  const upstockRes = await axios
    .get("")
    .then(() => {
      res.send({
        ok: true,
        Msg: upstockRes,
      });
    })
    .catch((error) => {
      res.status(500).send({
        ok: false,
        errMsg: error,
      });
    });
};
