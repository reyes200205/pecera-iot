import { Request, Response } from "express";
import { subHours } from "date-fns"; 
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = require("express").Router();

router.get("/temperatura/:deviceID", async (req: Request, res: Response) => {
    const deviceID = req.params.deviceID;

    try {
        const deviceIdInt = parseInt(deviceID);

        if (isNaN(deviceIdInt)) {
            return res.status(400).send("Error: Device ID not provided");
        }

        const aquarium = await prisma.aquarium.findFirst({
            where: {
                deviceId: deviceIdInt,
            },
            include: {
                sensors: {
                    include: {
                        readings: true,
                    }
                }
            },
        });

        if (!aquarium) {
            return res.status(404).send("Aquarium not found");
        }

        const temperaturaSensor = aquarium.sensors.find((sensor) => sensor.name === "temperatura");

        if (!temperaturaSensor) {
            return res.status(404).send("Sensor not found");
        }

        const readings = temperaturaSensor.readings;

        if (readings.length === 0) {
            return res.json({
                deviceID: deviceIdInt,
                averageTemperature: null,
                readingsCount: 0,
            });
        }

        const totalReadings = readings.reduce((acc, reading) => {
            return acc + parseFloat(reading.value);
        }, 0);

        const averageReadings = totalReadings / readings.length;

        res.json({
            deviceID: deviceIdInt,
            averageTemperature: averageReadings,
            readingsCount: readings.length,
        });

    } catch (error) {
        console.error("🔥 Error en la consulta:", error);
        res.status(500).send("Internal server error");
    }
});

router.get("/temperatura/max/:deviceID", async (req: Request, res: Response) => {
    const deviceID = req.params.deviceID;

    try {
        const deviceIdInt = parseInt(deviceID);

        if (isNaN(deviceIdInt)) {
            return res.status(400).send("Error: Device ID not provided");
        }

        const aquarium = await prisma.aquarium.findFirst({
            where: {
                deviceId: deviceIdInt,
            },
            include: {
                sensors: {
                    include: {
                        readings: {
                            where: {
                                timestamp: {
                                    gte: subHours(new Date(), 24) 
                                }
                            },
                            orderBy: {
                                value: "desc" 
                            },
                            take: 1 
                        }
                    }
                }
            },
        });

        if (!aquarium) {
            return res.status(404).send("Aquarium not found");
        }

        const temperaturaSensor = aquarium.sensors.find((sensor) => sensor.name === "temperatura");

        if (!temperaturaSensor || temperaturaSensor.readings.length === 0) {
            return res.status(404).send("No temperature data found in the last 24 hours");
        }

        const highestTemperature = parseFloat(temperaturaSensor.readings[0].value);

        res.json({
            deviceID: deviceIdInt,
            highestTemperature,
            timestamp: temperaturaSensor.readings[0].timestamp,
        });

    } catch (error) {
        console.error("🔥 Error en la consulta:", error);
        res.status(500).send("Internal server error");
    }
});

router.get("/temperatura/min/:deviceID", async (req: Request, res: Response) => {
    const deviceID = req.params.deviceID;

    try {
        const deviceIdInt = parseInt(deviceID);

        if (isNaN(deviceIdInt)) {
            return res.status(400).send("Error: Device ID not provided");
        }

        const aquarium = await prisma.aquarium.findFirst({
            where: { deviceId: deviceIdInt },
            include: {
                sensors: {
                    include: {
                        readings: {
                            where: {
                                timestamp: {
                                    gte: subHours(new Date(), 24)
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!aquarium) {
            return res.status(404).send("Aquarium not found");
        }

        const temperaturaSensor = aquarium.sensors.find(sensor => sensor.name === "temperatura");

        if (!temperaturaSensor) {
            return res.status(404).send("Sensor not found");
        }

        if (temperaturaSensor.readings.length === 0) {
            return res.status(404).send("No temperature data found in the last 24 hours");
        }

        
        const validReadings = temperaturaSensor.readings.filter(reading => !isNaN(parseFloat(reading.value)));
        
        if (validReadings.length === 0) {
            return res.status(404).send("No valid temperature data found in the last 24 hours");
        }

        
        const sortedReadings = validReadings.sort(
            (a, b) => parseFloat(a.value) - parseFloat(b.value)
        );

        const lowestTemperature = parseFloat(sortedReadings[0].value);

        res.json({
            deviceID: deviceIdInt,
            lowestTemperature,
            timestamp: sortedReadings[0].timestamp,
        });

    } catch (error) {
        res.status(500).send("Internal server error");
    }
});



export default router;