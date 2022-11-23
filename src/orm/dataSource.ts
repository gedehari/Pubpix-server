import { DataSource } from "typeorm";
import { User } from "./entity/User.entity";

export const dataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "pubpix",
    entities: [User]
});

export async function initDatabase() {
    await dataSource.initialize();
    console.log("Database initialized.");
}
