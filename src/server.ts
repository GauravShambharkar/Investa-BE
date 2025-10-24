import express from "express";

const investa = express().use(express.json());

investa.use("/investa/v1/readStocks", (req, res) => {
  res.send("Investa Backend is running");
});

const PORT = process.env.PORT || 5000;

investa.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
