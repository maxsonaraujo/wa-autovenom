import { Knex } from "knex";
import { Whatsapp } from "venom-bot";

declare global {

    var $db: Knex;
    var $whatsapp: Whatsapp;
    var $chatRoom: any;

    enum TB {
        TB_TABELA = "TB_TABELA"
    }

    interface Array<T> {
        customFilter(callback: (value: T, index: number, array: T[]) => boolean): T[];
    }

    interface IRocketMessage {
        "_id": string,
        "label": string,
        "createdAt": Date,
        "lastMessageAt": Date,
        "visitor": {
            "_id": string,
            "token": string,
            "name": string,
            "username": string,
            "email": string | null,
            "phone": [
                {
                    "phoneNumber": string
                }
            ]
        },
        "agent": {
            "_id": string,
            "username": string,
            "name": string,
            "email": string
        },
        "crmData": string,
        "type": string,
        "messages": [
            {
                "u": {
                    "_id": string,
                    "username": string,
                    "name": string
                },
                "_id": string,
                "username": string,
                "msg": string,
                "ts": string,
                "rid": string,
                "agentId": string,
                "_updatedAt": Date,
                file?: any,
                fileUpload:any,
            }
        ]
    }

    interface String {
        capitalize(): string;
    }
}

