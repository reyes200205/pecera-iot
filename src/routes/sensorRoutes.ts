import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getTemperaturaAguaData } from "../controllers/sensorController";
import dotenv from "dotenv";
import { verifyTokenAndDeviceID } from "../utils/tokenUtils";
dotenv.config();



const router = require("express").Router();

const jwtToken = process.env.JWT_SECRET

router.get("/test", (req: Request, res: Response) => {
  res.send("test");
});

router.get("/temperatura/:deviceID", (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    const requestDeviceID = req.params.deviceID; 

    if (!token) {
        return res.status(401).send("Error: Token not provided");
    }

    const hasAccess = verifyTokenAndDeviceID(token, requestDeviceID, res); 

    if (hasAccess) {
        console.log("Acceso autorizado para el Device ID:", requestDeviceID);  
        getTemperaturaAguaData(requestDeviceID, res);  
    }
});



export default router;