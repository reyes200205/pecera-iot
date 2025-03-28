import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

require("dotenv").config();

const prisma = new PrismaClient();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing");
}

const secret = process.env.JWT_SECRET;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, lastName, email, password } = req.body;

    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ msg: "Please fill all the fields" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        lastName,
        email,
        password: hashedPassword,
      },
    });


    const tokenRegister = jwt.sign(
      { userID: newUser.id },
      secret,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      msg: "User created successfully",
      tokenRegister,
      user: newUser,
    });

  } catch (error: any) {
    return res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please fill all the fields" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const pecera = await prisma.aquarium.findMany({
      where: { userId: user.id },
    });

    if (pecera.length === 0) {
      return res.status(404).json({ msg: "No aquarium found for this user" });
    }
    const deviceIDs = pecera.map((aquarium) => aquarium.deviceId);
    const token = jwt.sign(
      {
        userID: user.id,
        email: user.email,
        deviceIDs: deviceIDs,  
      },
      secret,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      msg: "User logged in successfully",
      token,
      deviceIDs
    });

  } catch (error) {
    return res.status(500).json({ msg: "Error in login", error });
  }
};
