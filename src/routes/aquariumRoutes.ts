import express, { Request, Response } from "express";
import { insertAquarium } from "../controllers/aquariumController";
const router = express.Router();

router.get("/test", (req: Request, res: Response) => {
  res.send("Aquarium");
});

router.post("/insert", (req: Request, res: Response) => {
  insertAquarium(req, res);
});

export default router;


