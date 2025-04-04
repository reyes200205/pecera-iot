import { Request, Response } from "express";
import { subHours } from "date-fns";
import { PrismaClient } from "@prisma/client";
import { json } from "stream/consumers";
import { client as mqttClient } from "../app";

const prisma = new PrismaClient();

export const getAverageTemperature = async (req: Request, res: Response) => {
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
                    include: { readings: true }
                }
            },
        });

        if (!aquarium) {
            return res.status(404).send("Aquarium not found");
        }

        const temperaturaSensor = aquarium.sensors.find(sensor => sensor.name === "temperatura");

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

        const totalReadings = readings.reduce((acc, reading) => acc + parseFloat(reading.value), 0);
        const averageReadings = parseFloat((totalReadings / readings.length).toFixed(2));

        res.json({
            deviceID: deviceIdInt,
            averageTemperature: averageReadings,
            readingsCount: readings.length,
        });

    } catch (error) {
        res.status(500).send("Internal server error");
    }
};

export const getMaxTemperature = async (req: Request, res: Response) => {
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

        const temperaturaSensor = aquarium.sensors.find(sensor => sensor.name === "temperatura");

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
};

export const getMinTemperature = async (req: Request, res: Response) => {
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

        const validReadings = temperaturaSensor.readings.filter(reading => !isNaN(parseFloat(reading.value)));

        if (validReadings.length === 0) {
            return res.status(404).send("No valid temperature data found in the last 24 hours");
        }

        const sortedReadings = validReadings.sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
        const lowestTemperature = parseFloat(sortedReadings[0].value);

        res.json({
            deviceID: deviceIdInt,
            lowestTemperature,
            timestamp: sortedReadings[0].timestamp,
        });

    } catch (error) {
        res.status(500).send("Internal server error");
    }
};


export const getFlujoAguaData = async (req: Request, res: Response) => {
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
                    include: { readings: true }
                }
            },
        });

        if (!aquarium) {
            return res.status(404).send("Aquarium not found");
        }

        const flujoAgua = aquarium.sensors.find(sensor => sensor.name === "flujoAgua");

        if (!flujoAgua) {
            return res.status(404).send("Sensor not found");
        }

        const validReadings = flujoAgua.readings.filter(reading => !isNaN(parseFloat(reading.value)));

        if (validReadings.length === 0) {
            return res.json({
                deviceID: deviceIdInt,
                averageWaterFlow: null,
                readingsCount: 0,
            });
        }

        const totalReadings = validReadings.reduce((acc, reading) => acc + parseFloat(reading.value), 0);
        const averageReadings = parseFloat((totalReadings / validReadings.length).toFixed(2));

        res.json({
            deviceID: deviceIdInt,
            averageWaterFlow: averageReadings,
            readingsCount: validReadings.length,
        });

    } catch (error) {
        res.status(500).send("Internal server error");
    }
};


export const getCalidadAguaData = async (req: Request, res: Response) => {
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
                    include: { readings: true }
                }
            },
        });

        if (!aquarium) {
            return res.status(404).send("Aquarium not found");
        }

        const calidadSensor = aquarium.sensors.find(sensor => sensor.name === "turbidez");

        if (!calidadSensor) {
            return res.status(404).send("Sensor not found");
        }

        const validReadings = calidadSensor.readings.filter(reading => !isNaN(parseFloat(reading.value)));

        if (validReadings.length === 0) {
            return res.json({
                deviceID: deviceIdInt,
                waterQualityLevel: "Sin datos",
                averageValue: null,
                readingsCount: 0,
            });
        }

        const total = validReadings.reduce((acc, r) => acc + parseFloat(r.value), 0);
        const average = parseFloat((total / validReadings.length).toFixed(2));

        let waterQualityLevel = "Desconocido";
        if (average < 4) waterQualityLevel = "Mala";
        else if (average < 7) waterQualityLevel = "Aceptable";
        else waterQualityLevel = "Buena";

        res.json({
            deviceID: deviceIdInt,
            averageValue: average,
            readingsCount: validReadings.length,
            waterQualityLevel
        });

    } catch (error) {
        res.status(500).send("Internal server error");
    }
};


export const onFeed = async (req: Request, res: Response) => {
    const deviceID = req.params.deviceID;

    if (!deviceID) {
        return res.status(400).send("Error: Device ID not provided");
    }

    const topic = `pecera/${deviceID}/feed`;
    const payload = "ON";

    try {
        mqttClient.publish(topic, payload, {}, (err) => {
            if (err) {
                console.error("❌ Error al publicar:", err);
                return res.status(500).send("Error al publicar el mensaje");
            }

            res.status(200).json({
                message: "Mensaje 'ON' enviado correctamente",
                topic,
                payload
            });
        });
    } catch (error) {
        console.error("🔥 Error interno:", error);
        res.status(500).send("Error interno del servidor");
    }
};



export const onLight = async (req: Request, res: Response) => {
    const deviceID = req.params.deviceID;

    if (!deviceID) {
        return res.status(400).send("Error: Device ID not provided");
    }

    const topic = `pecera/${deviceID}/light`;
    const payload = "on";

    try {
        mqttClient.publish(topic, payload, {}, (err) => {
            if (err) {
                return res.status(500).send("Error al publicar el mensaje");
            }

            res.status(200).json({
                message: "Mensaje 'ON' enviado correctamente",
                topic,
                payload
            });
        });
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
};

export const offLight = async (req: Request, res: Response) => {
    const deviceID = req.params.deviceID;

    if (!deviceID) {
        return res.status(400).send("Error: Device ID not provided");
    }

    const topic = `pecera/${deviceID}/light`;
    const payload = "Off";

    try {
        mqttClient.publish(topic, payload, {}, (err) => {
            if (err) {
                return res.status(500).send("Error al publicar el mensaje");
            }

            res.status(200).json({
                message: "Mensaje 'ON' enviado correctamente",
                topic,
                payload
            });
        });
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
};


