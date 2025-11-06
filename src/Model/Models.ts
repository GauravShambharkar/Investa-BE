import mongoose from "mongoose";

export const userModel = mongoose.model(
  "user",
  new mongoose.Schema({
    name: String,
    email: {
      type: String,
      required: true,
    },
    stocks: [
      {
        name: String,
        price: String,
      },
    ],
  })
);
