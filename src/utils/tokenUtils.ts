import jwt from "jsonwebtoken";
import { Response } from "express";

const jwtToken = process.env.JWT_SECRET;

export const verifyTokenAndDeviceID= (token: string, res: Response): string | null => {
    try {
        const decoded = jwt.verify(token, jwtToken || "");

        if (typeof decoded !== "string" && decoded.deviceID) {
            return decoded.deviceID;
        } else {
            res.status(401).send("Error: Invalid token");
            return null;
        }
    } catch (error) {
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
