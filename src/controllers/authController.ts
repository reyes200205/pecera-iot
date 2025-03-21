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
      where: {
        email,
      },
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
      {
        userID: newUser.id,
      },
      secret,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ msg: "User created successfully", tokenRegister });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please fill all the fields" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const pecera = await prisma.aquarium.findFirst({
      where: {
        userId: user.id,
      },
    });

    const peceraID = pecera ? pecera.id : null;
    const deviceID = pecera ? pecera.deviceId : "123";

    const token = jwt.sign(
      {
        userID: user.id,
        email: user.email,
        deviceID,
      },
      secret,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ msg: "User logged in successfully", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "error in login", error });
  }
};
