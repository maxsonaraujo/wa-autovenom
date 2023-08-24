// Supports ES6
import { create, Message, Whatsapp } from 'venom-bot';
import axios from 'axios';

let WEBHOOK;
let WEBHOOK_QRCODE;
let SESSION_NAME = "NO-NAME";
let TIMESTARTED = 0;



export const whatsapp = (): Promise<Whatsapp> => new Promise((resolve, reject) => {
    WEBHOOK_QRCODE = process.env?.WEBHOOK_QRCODE;
    WEBHOOK = process.env?.WEBHOOK;

    if (process.env?.SESSION_NAME)
        SESSION_NAME = process.env?.SESSION_NAME;

    console.log("Iniciando Whatsapp WEBHOOK:", WEBHOOK);
    console.log("Iniciando Whatsapp WEBHOOK_QRCODE:", WEBHOOK_QRCODE);

    create({
        session: SESSION_NAME, //name of session
        logQR: true,
    })
        .then(async (client) => {

            if (WEBHOOK_QRCODE)
                await client.waitForQrCodeScan((qrcode) => {
                    axios.post(WEBHOOK_QRCODE, { qrcode: qrcode }).then(res => { }).catch((err) => { console.error(err) })
                })

            client.onAnyMessage((event) => {
                sendEventWebhook("onAnyMessage", event)
            })

            client.onMessage((event) => {
                sendEventWebhook("onMessage", event)
            })

            client.onAck((event) => {
                sendEventWebhook("onAck", event)
            })

            client.onIncomingCall((event) => {
                sendEventWebhook("onIncomingCall", event)
            })

            client.onAddedToGroup((event) => {
                sendEventWebhook("onAddedToGroup", event)
            })

            resolve(client);
        })
        .catch((erro) => {
            reject(erro)
            console.error(erro);
        });


})

export const whatsappRocket = (): Promise<Whatsapp> => new Promise((resolve, reject) => {
    WEBHOOK_QRCODE = process.env?.WEBHOOK_QRCODE;
    WEBHOOK = process.env?.WEBHOOK;

    if (process.env?.SESSION_NAME)
        SESSION_NAME = process.env?.SESSION_NAME;

    console.log("Iniciando Whatsapp WEBHOOK:", WEBHOOK);
    console.log("Iniciando Whatsapp WEBHOOK_QRCODE:", WEBHOOK_QRCODE);

    create({
        session: SESSION_NAME, //name of session
        logQR: true,
    })
        .then(async (client) => {

            if (WEBHOOK_QRCODE)
                await client.waitForQrCodeScan((qrcode) => {
                    axios.post(WEBHOOK_QRCODE, { qrcode: qrcode }).then(res => { }).catch((err) => { console.error(err) })
                })

            // client.onAnyMessage((event) => {
            //     sendEventWebhook("onAnyMessage", event)
            // })

            TIMESTARTED = new Date().getTime();
            client.onMessage(async (event) => {

                // sendEventWebhook("onMessage", event)
                // if($chatsToken[])
                console.log("I", TIMESTARTED);
                console.log("T", event.t);
                if ((event.t * 1000) >= TIMESTARTED && event.from.includes("@c.us") && !event.fromMe) {
                    console.log("message", event.chatId, event.body, event.id);
                    if (!$chatRoom[event.chatId]) {
                        if (event.chatId.includes("@c.us")) {
                            let data = {
                                "visitor": {
                                    "name": event.sender.name,
                                    "email": "",
                                    "token": event.chatId,
                                    "department": "",
                                    "phone": event.chatId.replace("@c.us", ""),
                                    "customFields": [
                                        {
                                            "key": "notifyName",
                                            "value": event.notifyName,
                                            "overwrite": true
                                        }
                                    ]
                                }
                            }


                            await axios.post(WEBHOOK + "/api/v1/livechat/visitor", data).then(async (axiosResponse) => {
                                let response = axiosResponse.data;
                                if (response.success) {
                                    // $chatRoom[event.chatId]
                                    console.log("Registrado!");
                                }
                            }).catch(err => {
                                console.error(err);
                            });
                        }
                    }

                    await axios.get(WEBHOOK + "/api/v1/livechat/room", { params: { token: event.chatId } }).then((axiosResponse) => {
                        const response = axiosResponse.data;
                        if (response.success) {
                            $chatRoom[event.chatId] = response.room._id;
                        } else {
                            $chatRoom = null;
                        }
                    }).catch(err => {
                        console.error(err);
                    });

                    await sendMessage(event);




                } else {
                    console.log("Não entrou no critério", event);
                }
            })

            // client.onAck((event) => {
            //     sendEventWebhook("onAck", event)
            // })

            // client.onIncomingCall((event) => {
            //     sendEventWebhook("onIncomingCall", event)
            // })

            // client.onAddedToGroup((event) => {
            //     sendEventWebhook("onAddedToGroup", event)
            // })

            resolve(client);
        })
        .catch((erro) => {
            reject(erro)
            console.error(erro);
        });


})


const sendMessage = async (event: Message,) => {
    console.log("ENVIANDO####")

    switch (event.type) {
        case "chat":
            await axios.post(WEBHOOK + "/api/v1/livechat/message", {
                "token": event.chatId,
                "rid": $chatRoom[event.chatId],
                "msg": event.body
            }).catch(err => {
                console.error(err);
            });
            break;
        case "image":
            console.log(event);
            break;

        default:
            console.log("Não parametrizado", event);
            break;
    }

    // axios.post(WEBHOOK + "/api/v1/livechat/message", {
    //     "token": event.chatId,
    //     "rid": $chatRoom[event.chatId],
    //     "msg": event.content
    // })

}

const sendQrCODE = async () => {

}


const sendEventWebhook = (event: string, data: any) => {
    const SESSION_NAME = process.env.SESSION_NAME ? process.env.SESSION_NAME : "NO-NAME";
    const WEBHOOK = process.env.WEBHOOK ? process.env.WEBHOOK : "127.0.0.1/wa-me";

    const eventFormated = {
        ts: new Date().getTime(),
        sessionId: SESSION_NAME,
        id: 'a976b95a-acd1-4b9a-9a44-19cf8c9c070b',
        event: event,
        data: data,
        webhook_id: '3b2b2e9c-05fb-4974-8e79-6e8e2c1a1966'
    }

    if (WEBHOOK)
        axios.post(WEBHOOK,
            eventFormated
        ).then(res => {
            // console.log(res);
        }).catch(err => {
            // console.error(err);
        });
}


