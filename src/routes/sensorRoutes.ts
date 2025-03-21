import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getAguaData } from "../controllers/sensorController";
import dotenv from "dotenv";
import { verifyTokenAndDeviceID } from "../utils/tokenUtils";
dotenv.config();



const router = require("express").Router();

const jwtToken = process.env.JWT_SECRET

router.get("/test", (req: Request, res: Response) => {
  res.send("test");
});

router.get("/agua", (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).send("Error: Token not provided");
    }
    const deviceID = verifyTokenAndDeviceID(token, res);
    if (deviceID) {
        console.log("Device ID extraído:", deviceID);
        getAguaData(deviceID, res);
    }
});


export default router;