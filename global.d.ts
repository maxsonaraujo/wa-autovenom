import { Knex } from "knex";
import { Whatsapp } from "venom-bot";

declare global {

    var $db: Knex;
    var $whatsapp: Whatsapp | Promise<Whatsapp>;

    enum TB {
        TB_TABELA = "TB_TABELA"
    }

    interface Array<T> {
        customFilter(callback: (value: T, index: number, array: T[]) => boolean): T[];
    }

    interface String {
        capitalize(): string;
    }
}

