import jwt from "jsonwebtoken";
import { Response } from "express";

const jwtToken = process.env.JWT_SECRET;

export const verifyTokenAndDeviceID = (token: string, res: Response): string | null => {
    console.log("Token recibido:", token);  // 👀 Verifica el token recibido

    try {
        const decoded = jwt.verify(token, jwtToken || "");
        console.log("Token decodificado:", decoded); 

        if (typeof decoded !== "string" && decoded.deviceID) {
            console.log("DeviceID encontrado:", decoded.deviceID);  
            return decoded.deviceID;
        } else {
            console.log("Token inválido o sin deviceID");
            res.status(401).send("Error: Invalid token");
            return null;
        }
    } catch (error) {
        console.error("Error al verificar el token:", error);  // 👀 Muestra el error en caso de fallo
        res.status(500).send("Error: al verificar el token");
        return null;
    }
};


export const verifyTokenUserID = (token: string, res: Response): string | null => {
    try {
        const decoded = jwt.verify(token, jwtToken || "");

        if (typeof decoded !== "string" && decoded.userID) {
            return decoded.userID;
        } else {
            res.status(401).send("Error: Invalid token");
            return null;
        }
    } catch (error) {
        res.status(500).send("Error: al verificar el token");
        return null;
    }
}
