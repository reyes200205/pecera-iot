import { Request, Response } from "express";

const urlMqtt = process.env.URL_MQTT || "mqtt://localhost";
const username = process.env.USER_MQTT || "admin";
const password = process.env.PASSWORD_MQTT || "admin";
const credentials = btoa(`${username}:${password}`);

export const getTemperaturaAguaData = async (deviceID: string,res: Response) => {
  try {
    if (!deviceID) {
      return res.status(400).send("Error: Device ID not provided");
    }

    const topic = `pecera-${deviceID}-temperatura`;
    const baseUrl = `${urlMqtt}/api/v5/mqtt/retainer/message/${topic}`;

    const response = await fetch(baseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      const dataSensor = Buffer.from(data.payload, "base64");

      res.json({
        message: "Data fetched successfully",
        data: dataSensor.toString(),
      });
    } else {
      res.status(response.status).send("Error: Could not fetch data");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: Something went wrong");
  }
};


export const getNivelAguaData = async (deviceID: string,res: Response) => {
  try {
    if (!deviceID) {
      return res.status(400).send("Error: Device ID not provided");
    }

    const topic = `pecera-${deviceID}-nivelAgua`;
    const baseUrl = `${urlMqtt}/api/v5/mqtt/retainer/message/${topic}`;

    const response = await fetch(baseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      const dataSensor = Buffer.from(data.payload, "base64");

      res.json({
        message: "Data fetched successfully",
        data: dataSensor.toString(),
      });
    } else {
      res.status(response.status).send("Error: Could not fetch data");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: Something went wrong");
  }
};


export const getFlujoAguaData = async (deviceID: string,res: Response) => {
  try {
    if (!deviceID) {
      return res.status(400).send("Error: Device ID not provided");
    }

    const topic = `pecera-${deviceID}-flujoAgua`;
    const baseUrl = `${urlMqtt}/api/v5/mqtt/retainer/message/${topic}`;

    const response = await fetch(baseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      const dataSensor = Buffer.from(data.payload, "base64");

      res.json({
        message: "Data fetched successfully",
        data: dataSensor.toString(),
      });
    } else {
      res.status(response.status).send("Error: Could not fetch data");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: Something went wrong");
  }
};

export const getLuzData = async (deviceID: string,res: Response) => {
  try {
    if (!deviceID) {
      return res.status(400).send("Error: Device ID not provided");
    }

    const topic = `pecera-${deviceID}-luz`;
    const baseUrl = `${urlMqtt}/api/v5/mqtt/retainer/message/${topic}`;

    const response = await fetch(baseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      const dataSensor = Buffer.from(data.payload, "base64");

      res.json({
        message: "Data fetched successfully",
        data: dataSensor.toString(),
      });
    } else {
      res.status(response.status).send("Error: Could not fetch data");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: Something went wrong");
  }
};


export const feedAquarium = async (deviceID: string, res: Response) => {
  try {
    if (!deviceID) {
      return res.status(400).send("Error: Device ID not provided");
    }

    const topic = `pecera-${deviceID}-feed`;
    const baseUrl = `${urlMqtt}/api/v5/mqtt/publish`;

    const payload = {
      topic: topic,
      payload: "feed",
      qos: 1,
      retain: false
    };

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    const data = await response.json();

    return res.status(200).json({ message: "Mensaje publicado con éxito", data });

  } catch (error) {
    console.error("Error publicando en MQTT:", error);
    return res.status(500).send("Error publicando en MQTT");
  }
};
