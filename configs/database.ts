import knex from 'knex';

const HOST = <string>(process.env.DB_HOST ? process.env.DB_HOST : '127.0.0.1');
const PORT = <number>(process.env.DB_PORT ? process.env.DB_PORT : 3306);
const USER = <string>(process.env.DB_USER ? process.env.DB_USER : 'root');
const PASSWORD = <string>(process.env.DB_PASSWORD ? process.env.DB_PASSWORD : '');
const DATABASE = <string>(process.env.DB_DATABASE ? process.env.DB_DATABASE : 'database');

export const db = knex({
    client: 'mysql',
    connection: {
        host: HOST,
        port: PORT,
        user: USER,
        password: PASSWORD,
        database: DATABASE
    }
});
