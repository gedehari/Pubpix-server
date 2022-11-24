import { DataSource } from "typeorm";
import { User } from "./entities/User.entity";

export const dataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "pubpix",
    entities: [User]
});

export async function initDatabase() {
    await dataSource.initialize();
    console.log("Database initialized.");
}
