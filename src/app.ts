import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mqtt from "mqtt";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes";
import sensorRoutes from "./routes/sensorRoutes";
import aquariumRoutes from "./routes/aquariumRoutes";
import userRoutes from "./routes/userRoutes";
import statsRoutes from "./routes/statsRoutes";
import alertRoutes from "./routes/alertRoutes";
dotenv.config();

const prisma = new PrismaClient();
export const client = mqtt.connect("mqtt://18.191.162.194");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3001;

type SensorName = 'temperatura' | 'turbidez' | 'oxigeno' | 'ph' | 'nivelAgua';

const sensorLimit: Record<SensorName, { min: number; max?: number }> = {
  temperatura: { min: 10, max: 35 },
  turbidez: { min: 1, max: 5 },
  oxigeno: { min: 3, max: 8 },
  ph: { min: 6.5, max: 8.5 },
  nivelAgua: { min: 20 }
};

client.on("connect", () => {
  console.log("Connected to MQTT server");
  client.subscribe("pecera/#", (err) => {
    if (err) {
      console.log("Failed to subscribe:", err);
    }
  });
});

client.on("message", (topic, message) => {
  const topicSplit = topic.split("/");
  const sensor = topicSplit[topicSplit.length - 1];
  const deviceID = topicSplit[topicSplit.length - 2];
  const timestamp = new Date();
  const payload = message.toString();

  saveMessage(deviceID, sensor, payload, timestamp);
});

async function saveMessage(deviceID: string, sensor: string, payload: string, timestamp: Date) {
  try {
    const deviceIdInt = parseInt(deviceID);
    if (isNaN(deviceIdInt)) return;

    const aquarium = await prisma.aquarium.findFirst({
      where: { deviceId: deviceIdInt },
    });
    if (!aquarium) return;

    let existingSensor = await prisma.sensor.findFirst({
      where: {
        name: sensor,
        aquariumId: aquarium.id,
      },
    });

    if (!existingSensor) {
      existingSensor = await prisma.sensor.create({
        data: {
          name: sensor,
          type: sensor,
          aquariumId: aquarium.id,
        },
      });
    }

    await prisma.reading.create({
      data: {
        value: payload,
        sensorId: existingSensor.id,
        timestamp,
      },
    });

    if (sensor in sensorLimit) {
      const limits = sensorLimit[sensor as SensorName];
      const value = parseFloat(payload);
      const isBelowMin = limits.min !== undefined && value < limits.min;
      const isAboveMax = limits.max !== undefined && value > limits.max;

      if (isBelowMin || isAboveMax) {
        const message = isBelowMin
          ? `${sensor} por debajo del límite mínimo (${limits.min})`
          : `${sensor} por encima del límite máximo (${limits.max})`;

        await prisma.alert.create({
          data: {
            message,
            aquariumId: aquarium.id,
            sensorId: existingSensor.id,
          },
        });
      }
    }

  } catch (error) {
    console.log("Error saving message:", error);
  }
}

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Mundo!");
});

app.use("/auth", authRoutes);
app.use("/sensor", sensorRoutes);
app.use("/aquarium", aquariumRoutes);
app.use("/user", userRoutes);
app.use("/stats", statsRoutes);
app.use("/alerts", alertRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
