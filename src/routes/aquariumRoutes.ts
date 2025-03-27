import express, { Request, Response } from "express";
import { insertAquarium } from "../controllers/aquariumController";
import { verifyTokenUserID } from "../utils/tokenUtils";
import { getAquariums } from "../controllers/aquariumController";

const router = require("express").Router();

router.get("/test", (req: Request, res: Response) => {
  res.send("Aquarium");
});

router.get("/all", (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Error: Token no privided");
  }

  const userID = verifyTokenUserID(token, res);
  if (userID) {
    getAquariums(req, res, userID);
  }
});

router.post("/insert", (req: Request, res: Response) => {
  insertAquarium(req, res);
});

export default router;
