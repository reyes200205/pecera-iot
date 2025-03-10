import express, { Request, Response, Router } from 'express';
import { Login } from '../controllers/authController';


const router = express.Router();


router.get('/test', (req: Request, res: Response) => {
  res.send('test');
});

router.post('/login', (req: Request, res: Response) => {
  res.send(Login(req, res));
});

export default router;