import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import { type Request, type Response } from "express";

export const getAccessToken = async (req: Request, res: Response) => {
  const code = req.query.code;

  try {
    const token = await axios.post(
      "https://api.upstox.com/v2/login/authorization/token",
      {
        code,
        client_id: process.env.UPSTOX_CLIENT_ID,
        client_secret: process.env.UPSTOX_CLIENT_SECRET,
        redirect_uri: "http://localhost:4000/auth/upstox/callback",
        grant_type: "authorization_code",
      }
    );

    res.json(token.data);
  } catch (err: any) {
    res.status(500).json({ error: err.response?.data || err.message });
  }

  // try {
  //   const upstockRes = await axios
  //     .get("")
  //     .then(() => {
  //       res.send({
  //         ok: true,
  //         Msg: upstockRes,
  //       });
  //     })
  //     .catch((error) => {
  //       res.status(500).send({
  //         ok: false,
  //         errMsg: error,
  //       });
  //     });
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).send({
  //     ok: false,
  //     errMsg: error,
  //   });
  // }
};
