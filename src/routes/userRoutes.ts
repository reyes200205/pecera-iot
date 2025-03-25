import { Request, Response } from "express";
import { getDataUser } from "../controllers/userController";
import { updateUser } from "../controllers/userController";
import { updatePassword } from "../controllers/userController";
import { getDataAquarium } from "../controllers/userController";

const router = require("express").Router();

router.get("/data/:id", (req: Request, res: Response) => {
    getDataUser(req, res, req.params.id);
});

router.get("/data/aquarium/:id", (req: Request, res: Response)=> {
    getDataAquarium(req, res, req.params.id)
});



router.patch("/update/:id", (req: Request, res: Response) => {
    updateUser(req, res, req.params.id);
});

router.patch("/update/password/:id", (req: Request, res:Response)=> {
    updatePassword(req, res, req.params.id)
});


router.get("/test", (req: Request, res: Response)=>{
   res.send("data")
})

export default router;