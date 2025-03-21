import express, { Request, Response, Router } from 'express';
import { loginUser } from '../controllers/authController';
import { registerUser } from '../controllers/authController';


const router = express.Router();


router.get('/test', (req: Request, res: Response) => {
  res.send('test');
});

router.post('/login', (req: Request, res: Response) => {
  loginUser(req, res);
});

router.post('/register', (req: Request, res: Response) => {
  registerUser(req, res);
});

export default router;