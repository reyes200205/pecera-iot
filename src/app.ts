import express from "express";
import dotenv from "dotenv";
import mqtt from "mqtt";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello mundo World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});