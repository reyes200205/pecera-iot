import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAlerts = async (req: Request, res: Response, deviceID: string) => {
    const aquariumID = req.params.id;
    try {
        const aquarium = await prisma.aquarium.findFirst({
            where: {
                deviceId: parseInt(deviceID),  
            },
        });

        if (!aquarium) {
            return res.status(404).json({ msg: "Aquarium not found" });
        }

        const alerts = await prisma.alert.findMany({
            where: {
                aquariumId: aquarium.id,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return res.status(200).json(alerts);
    }catch (err) {
        res.status(500).json({ msg: "Error getting alerts" });
    }
}