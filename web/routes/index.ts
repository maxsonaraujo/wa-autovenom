import express, { Router, Request, Response } from 'express';
import path from 'path';

const router: Router = express.Router();

// Rota principal
router.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Página inicial' });
});

export default router;
