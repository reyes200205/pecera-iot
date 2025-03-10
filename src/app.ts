import express from "express";
import dotenv from "dotenv";
import mqtt from "mqtt";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello mundo World!");
});

app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});