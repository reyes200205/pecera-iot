import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"

const prisma = new PrismaClient();

export const getDataUser = async (req: Request, res: Response, userId: string) => {
    try {
        if (!userId) {
            return res.status(401).send("Error: user not provided");
        }

        const response = await prisma.user.findUnique({
            where: {
                id: isNaN(Number(userId)) ? undefined : Number(userId), 
            }
        });

        if (!response) {
            return res.status(404).send("User not found");
        }
        res.status(200).json({
            name: response.name,
            email: response.email,
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal server error");
    }
};

export const getDataAquarium = async (req: Request, res: Response, userId: string) => {
    try {
        if (!userId) {
            return res.status(401).send("Error: user not provided");
        }

        
        const response = await prisma.aquarium.findFirst({
            where: {
                userId: isNaN(Number(userId)) ? undefined : Number(userId),  
            }
        });

        if (!response) {
            return res.status(404).send("Aquarium not found for this user");
        }

        res.status(200).json({
            name: response.name,
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal server error");
    }
};
    

export const updateUser = async (req: Request, res: Response, userId: string) => {
    try {
        if (!userId) {
            return res.status(401).send("Error: user not provided");
        }

        const response = await prisma.user.update({
            where: {
                id: isNaN(Number(userId)) ? undefined : Number(userId),
            },
            data: {
                name: req.body.name,
                email: req.body.email,
            }
        });

        res.status(200).json({
            name: response.name,
            email: response.email,
        });
    }catch(error){
        console.error("Error:", error);
        res.status(500).send("Internal server error");
    }
};

export const updatePassword = async (req: Request, res: Response, userId: string) => {
    try {
        if (!userId) {
            return res.status(401).send("User not provided");
        }

        if (!req.body.password) {
            return res.status(400).send("Password is required");
        }

       
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        
        const response = await prisma.user.update({
            where: {
                id: isNaN(Number(userId)) ? undefined : Number(userId),
            },
            data: {
                password: hashedPassword,
            }
        });

       
        res.status(200).json({
            message: "Password updated successfully",
            userId: response.id
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal server error");
    }
};
