import express, { Router, Request, Response, response } from 'express';
import axios from 'axios';
import {
  detectBufferMime,
} from 'mime-detect'


const router: Router = express.Router();

// Rota da API


router.post('/webhook', (req: Request, res: Response) => {

  let hook = <IRocketMessage>req.body;
  console.log("HOOK RECEBIDO", hook);
  if (hook.type === "Message") {

    if (hook.messages[0]?.file) {
      $whatsapp.sendFile(hook.visitor.token, hook.messages[0].fileUpload.publicFilePath)
      return;
    }

    //Caso nenhum dos critérios anteriores
    $whatsapp.sendText(hook.visitor.token, hook.messages[0].msg)
  }

  return;

  // res.json({ message: `Olá!` });
});

router.post('/sendText', async (req: Request, res: Response) => {

  if (!req.body.args)
    return res.status(400).json({ success: false, message: "Erro 400: Bad Request - Parâmetros necessários não enviados! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos na requisição." })

  const { to, content } = req.body?.args;

  try {
    await $whatsapp
      .sendText(to, content)
      .then((result) => {
        return res.json(result);
      })
      .catch((erro) => {
        return res.status(400).json(erro); //return object error
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro 500: Internal Erro Server! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos corretamente na requisição.")
  }

});

router.post('/sendFile', async (req: Request, res: Response) => {

  if (!req.body)
    return res.status(400).json({ success: false, message: "Erro 400: Bad Request - Parâmetros necessários não enviados! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos na requisição." })

  const { to, filename, file } = req.body?.args;

  const regexUrl = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  let filePrepared = file;

  if (file && file.match(regexUrl)) {
    filePrepared = await getImageAsBase64(file);
  }

  try {
    await $whatsapp
      .sendFileFromBase64(to, filePrepared, filename)
      .then((result) => {
        return res.json(result);
      })
      .catch((erro) => {
        return res.status(400).json(erro); //return object error
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro 500: Internal Erro Server! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos corretamente na requisição.")
  }

});

router.post('/sendMenuList', async (req: Request, res: Response) => {

  if (!req.body)
    return res.status(400).json({ success: false, message: "Erro 400: Bad Request - Parâmetros necessários não enviados! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos na requisição." })

  const { to, title, description, buttonText, menu } = req.body?.args;

  if (!to || !title || !description || !buttonText || !menu)
    return res.status(400).json({ success: false, message: "Erro 400: Bad Request - Parâmetros necessários não enviados! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos na requisição." })


  try {
    await $whatsapp
    //@ts-ignore
      .sendListMenu(to, title, description, buttonText, menu)
      .then((result) => {
        return res.json(result);
      })
      .catch((erro) => {
        return res.status(400).json(erro); //return object error
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro 500: Internal Erro Server! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos corretamente na requisição.")
  }

});

router.post('/sendButtons', async (req: Request, res: Response) => {

  if (!req.body)
    return res.status(400).json({ success: false, message: "Erro 400: Bad Request - Parâmetros necessários não enviados! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos na requisição." })

  const { to, title, description, buttons } = req.body?.args;

  if (!to || !title || !description || !buttons)
    return res.status(400).json({ success: false, message: "Erro 400: Bad Request - Parâmetros necessários não enviados! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos na requisição." })

  try {
    await $whatsapp
      .sendButtons(to, title, buttons, description)
      .then((result) => {
        return res.json(result);
      })
      .catch((erro) => {
        return res.status(400).json(erro); //return object error
      });

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro 500: Internal Erro Server! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos corretamente na requisição.")
  }
});


router.post('/wa/:fuctionName', async (req: Request, res: Response) => {
  console.log("iniciou")
  if (!req.body)
    return res.status(400).json({ success: false, message: "Erro 400: Bad Request - Parâmetros necessários não enviados! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos na requisição." })

  console.log("antes")

  try {
    console.log("req params", req.params);
    console.log("req body", req.body);

    console.log(req.params.fuctionName)
    let args = req.body.args;
    let argsArray: Array<any> = [];
    for (const key in args) {
      argsArray.push(args[key]);
    }

    console.log(argsArray);
    console.log("arrayagora");
    console.log(...argsArray);
    console.log("FIM ARRAY")

    await $whatsapp[req.params.fuctionName](...argsArray)
      .then((result) => {
        return res.json(result);
      })
      .catch((erro) => {
        return res.status(400).json(erro); //return object error
      });

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro 500: Internal Erro Server! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos corretamente na requisição.")
  }
});

router.post('/decryptMedia', async (req: Request, res: Response) => {

  if (!req.body?.args || !req.body.args?.message)
    return res.status(400).json({ success: false, message: "Erro 400: Bad Request - Parâmetros necessários não enviados! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos na requisição." })

  try {
    let message = req.body.args.message;
    if (!message?.clientUrl) {
      const splits = message.split("_");
      const chatID = splits[0];
      console.log(chatID); // Output: "120363025539312557"

      let messages = await $whatsapp.getAllMessagesInChat(chatID, true, false);
      messages.forEach(msg => {
        if (msg.id === message) {
          message = msg;
        }
      });
    }


    let success = true;
    let response: any = "";
    const buffer = await $whatsapp.decryptFile(message)
      .catch((erro) => {
        success = false;
        response = erro;
      });
    response = buffer?.toString("base64url");
    res.json({ success, response });

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro 500: Internal Erro Server! Por favor, verifique se todos os parâmetros obrigatórios foram incluídos corretamente na requisição.")
  }
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
