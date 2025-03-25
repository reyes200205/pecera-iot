import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const insertAquarium = async (req: Request, res: Response) => {
    try {

        const { name, deviceID, userID } = req.body;

        if (!name || !deviceID || !userID) {
            console.warn("Missing fields:", { name, deviceID, userID });
            return res.status(400).json({ msg: "Please fill all the fields" });
        }

        const deviceIdInt = parseInt(deviceID); 
        if (isNaN(deviceIdInt)) {
            console.warn("Invalid device ID format:", deviceID);
            return res.status(400).json({ msg: "Invalid device ID format" });
        }

        const existingAquarium = await prisma.aquarium.findFirst({
            where: {
                deviceId: deviceIdInt,  
            },
        });


        if (existingAquarium) {
            console.warn("Aquarium already exists with deviceId:", deviceID);
            return res.status(400).json({ msg: "Aquarium already exists" });
        }

        const newAquarium = await prisma.aquarium.create({
            data: {
                name,
                deviceId: deviceIdInt,    
                userId: parseInt(userID), 
            },
        });

        console.log("New aquarium created:", newAquarium);

        return res.status(201).json({ msg: "Aquarium created successfully", newAquarium });

    } catch (err) {
        console.error("Error creating aquarium:", err);
        return res.status(500).json({ msg: "Internal server error", error: err });
    }
};
