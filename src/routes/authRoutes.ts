import express, { Request, Response, Router } from 'express';


const router = express.Router();


router.get('/test', (req: Request, res: Response) => {
  res.send('test');
});

router.post('/login', (req: Request, res: Response) => {
  res.send('login');
});

export default router;