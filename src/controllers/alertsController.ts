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

        
        const formattedAlerts = alerts.map(alert => ({
            ...alert,
            createdAt: new Date(alert.createdAt).toLocaleString('es-MX', {
                timeZone: 'America/Mexico_City',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        }));

        return res.status(200).json(formattedAlerts);
    } catch (err) {
        res.status(500).json({ msg: "Error getting alerts" });
    }
};
