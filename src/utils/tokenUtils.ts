import jwt from "jsonwebtoken";
import { Response } from "express";

const jwtToken = process.env.JWT_SECRET;

export const verifyTokenAndDeviceID = (
    token: string, 
    requestedDeviceID: string, 
    res: Response
): boolean => {

    console.log("Token recibido:", token);  
    console.log("DeviceID solicitado:", requestedDeviceID);  

    try {
        const decoded = jwt.verify(token, jwtToken || "") as { deviceIDs: number[] };
        
        if (decoded.deviceIDs.includes(parseInt(requestedDeviceID))) {
            return true;  
        } else {
            res.status(403).json({ msg: "Access denied. This aquarium does not belong to you." });
            return false;
        }

    } catch (error) {
        console.error("Error al verificar el token:", error);
        res.status(401).json({ msg: "Invalid token" }); 
        return false;
    }
};



export const verifyTokenUserID = (token: string, res: Response): string | null => {
    try {
        console.log("Verificando token:", token);  // Log del token recibido

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
        console.log("Token decodificado:", decoded);  // Log del token decodificado

        if (typeof decoded === "object" && "userID" in decoded) {
            console.log("Token válido, userID:", decoded.userID);  // Log si el token es válido
            return decoded.userID as string;
        } else {
            console.log("Token inválido o sin userID");
            res.status(401).send("Error: Invalid token");
            return null;
        }
    } catch (error) {
        console.error("Error al verificar el token:", error);  // Log del error
        res.status(500).send("Error: al verificar el token");
        return null;
    }
};
