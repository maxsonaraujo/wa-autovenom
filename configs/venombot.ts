// Supports ES6
import { create, Whatsapp } from 'venom-bot';
import axios from 'axios';

export const whatsapp = (): Promise<Whatsapp> => new Promise((resolve, reject) => {

    const SESSION_NAME = process.env.SESSION_NAME ? process.env.SESSION_NAME : "NO-NAME";
    const WEBHOOK = process.env.WEBHOOK ? process.env.WEBHOOK : "127.0.0.1/wa-me";
    const WEBHOOK_QRCODE = process.env.WEBHOOK_QRCODE ? process.env.WEBHOOK_QRCODE : "127.0.0.1/wa-me/qrcode";

    create({
        session: SESSION_NAME, //name of session
        logQR: true,
    })
        .then(async (client) => {

            await client.waitForQrCodeScan((qrcode) => {
                axios.post(WEBHOOK_QRCODE).then(res => { }).catch((err) => {console.error(err) })
            })

            client.onMessage((msg) => {
                console.log(msg);
                axios.post(WEBHOOK, msg).then(res => {

                }).catch(err => {
                    console.error(err);
                });
            })

            resolve(client);
        })
        .catch((erro) => {
            reject(erro)
            console.log(erro);
        });


})


