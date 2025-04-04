import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getTemperaturaAguaData } from "../controllers/sensorController";
import { getNivelData } from "../controllers/sensorController";
import { getFlujoAguaData } from "../controllers/sensorController";
import { getLuzData } from "../controllers/sensorController";
import { getTdsData } from "../controllers/sensorController";
import { getTurbidezData } from "../controllers/sensorController";
import { feedAquarium } from "../controllers/sensorController";
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
        getTemperaturaAguaData(requestDeviceID, res);  
    }
});

router.get("/agua/:deviceID", (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    const requestDeviceID = req.params.deviceID; 

    if (!token) {
        return res.status(401).send("Error: Token not provided");
    }

    const hasAccess = verifyTokenAndDeviceID(token, requestDeviceID, res); 

    if (hasAccess) {
        getNivelData(requestDeviceID, res);
    }
});

router.get("/flujoAgua/:deviceID", (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    const requestDeviceID = req.params.deviceID; 

    if (!token) {
        return res.status(401).send("Error: Token not provided");
    }

    const hasAccess = verifyTokenAndDeviceID(token, requestDeviceID, res); 

    if (hasAccess) {
        getFlujoAguaData(requestDeviceID, res);  
    }
});

router.get("/tds/:deviceID", (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    const requestDeviceID = req.params.deviceID; 

    if (!token) {
        return res.status(401).send("Error: Token not provided");
    }

    const hasAccess = verifyTokenAndDeviceID(token, requestDeviceID, res); 

    if (hasAccess) {
        getTdsData(requestDeviceID, res);
    }
});

router.get("/turbidez/:deviceID", (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    const requestDeviceID = req.params.deviceID; 

    if (!token) {
        return res.status(401).send("Error: Token not provided");
    }

    const hasAccess = verifyTokenAndDeviceID(token, requestDeviceID, res); 

    if (hasAccess) {
        getTurbidezData(requestDeviceID, res);
    }
});

router.get("/luz/:deviceID", (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    const requestDeviceID = req.params.deviceID; 

    if (!token) {
        return res.status(401).send("Error: Token not provided");
    }

    const hasAccess = verifyTokenAndDeviceID(token, requestDeviceID, res); 

    if (hasAccess) {
        getLuzData(requestDeviceID, res);
    }
});

router.post("/feed/:deviceID", (req: Request, res: Response) => {
    feedAquarium(req.params.deviceID, res);
});




export default router;