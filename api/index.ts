import express, { Router, Request, Response } from 'express';
import axios from 'axios';
import {
  detectBufferMime,
} from 'mime-detect'


const router: Router = express.Router();

// Rota da API


router.post('/webhook', (req: Request, res: Response) => {

  console.log("params", req.params);
  console.log("query", req.query);
  console.log("body", req.body);
  console.log("headers", req.headers);

  res.json({ message: `Olá!` });
});

router.post('/sendText', async (req: Request, res: Response) => {

  if (!req.body.args)
    return res.status(400).json({ success: false, message: "Erro 400: Bad Request - Parâmetros necessários não enviados! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos na requisição." })

  const { to, content } = req.body?.args;

  await $whatsapp
    .sendText(to, content)
    .then((result) => {
      return res.json(result);
    })
    .catch((erro) => {
      return res.status(400).json(erro); //return object error
    });

});

router.post('/sendFile', async (req: Request, res: Response) => {

  if (!req.body.args)
    return res.status(400).json({ success: false, message: "Erro 400: Bad Request - Parâmetros necessários não enviados! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos na requisição." })

  const { to, filename, file } = req.body?.args;

  const regexUrl = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  let filePrepared = file;

  if (file && file.match(regexUrl)) {
    filePrepared = await getImageAsBase64(file);
  }

  await $whatsapp
    .sendFileFromBase64(to, filePrepared, filename)
    .then((result) => {
      return res.json(result);
    })
    .catch((erro) => {
      return res.status(400).json(erro); //return object error
    });

});

router.post('/sendListMenu', async (req: Request, res: Response) => {

  if (!req.body.args)
    return res.status(400).json({ success: false, message: "Erro 400: Bad Request - Parâmetros necessários não enviados! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos na requisição." })

  const { to, title, description, buttonText, menu } = req.body?.args;

  await $whatsapp
    .sendListMenu(to, title, description, buttonText, menu)
    .then((result) => {
      return res.json(result);
    })
    .catch((erro) => {
      return res.status(400).json(erro); //return object error
    });

});

router.post('/sendButtons', async (req: Request, res: Response) => {

  if (!req.body.args)
    return res.status(400).json({ success: false, message: "Erro 400: Bad Request - Parâmetros necessários não enviados! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos na requisição." })

  const { to, title, description, buttons } = req.body?.args;

  await $whatsapp
    .sendButtons(to, title, buttons, description)
    .then((result) => {
      return res.json(result);
    })
    .catch((erro) => {
      return res.status(400).json(erro); //return object error
    });

});












async function getImageAsBase64(url: string): Promise<string> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer', // definindo o tipo de resposta como arraybuffer
  });
  const buffer = Buffer.from(response.data, 'binary'); // convertendo para buffer
  const base64 = buffer.toString('base64'); // convertendo para base64


  const type = await detectBufferMime(buffer);
  console.log(type)
  const prefix = `data:${type};base64,`;

  return prefix + base64;
}




export default router;
