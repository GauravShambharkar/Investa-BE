import mongoose from "mongoose";

type stockDataType = {
  name: string;
  price: string;
};

interface schemaType {
  name: string;
  email: string;
  stocks: stockDataType;
}

export const userModel = mongoose.model(
  "user",
  new mongoose.Schema<schemaType>({
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
