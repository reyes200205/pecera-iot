import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import sensorRoutes from "./routes/sensorRoutes";
import aquariumRoutes from "./routes/aquariumRoutes";

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello mundo World!");
});

app.use("/auth", authRoutes);

app.use("/sensor", sensorRoutes); 

app.use("/aquarium",aquariumRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});