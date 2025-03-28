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
  const token = req.headers.authorization;  

  if (token) {
    console.log(`Token recibido: ${token}`);
  } else {
    console.log('No se recibió token');
  }

  registerUser(req, res);
});

export default router;