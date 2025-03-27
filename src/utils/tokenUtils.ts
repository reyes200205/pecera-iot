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
