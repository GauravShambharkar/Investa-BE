import type { Request, Response } from "express";
import { userModel } from "../Model/Models.js";

export async function createUser(req: Request, res: Response) {
  const { name, email } = req.body;

  const user = await userModel.create({
    email: email,
    name: name,
  });

  if (!user) {
    return res.status(500).send({
      ok: false,
      errMsg: "Server had issue while creating user",
    });
  }

  res.send({
    ok: true,
    errMsg: "user has created succesfully",
    userData: user
  });
}
