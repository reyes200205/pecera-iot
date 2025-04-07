import express, { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { getAlerts } from '../controllers/alertsController';

const router = require('express').Router();

const prisma = new PrismaClient();

router.get('/All/:deviceID', (req: Request, res: Response) => {
    getAlerts(req, res, req.params.deviceID);
});

export default router;
