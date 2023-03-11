import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

// Rota da API


/**
 * @swagger
 * /api/hello:
 *   post:
 *     description: Cria um novo usuário
 *     parameters:
 *       - name: username
 *         description: Nome do usuário
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: E-mail do usuário
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 */
router.get('/api/hello', (req: Request, res: Response) => {
  
  const name: string = req.params.name;
  res.json({ message: `Olá, ${name}!` });
});



export default router;
