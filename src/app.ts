import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";

import user from "routes/user.route"
import { initDatabase } from "orm/dataSource";
import { checkAuth } from "controllers/auth.controller";

initDatabase();

// env vars
const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());

app.use("/user", user);

app.get("/", (req: Request, res: Response) => {
    res.send("test");
});

app.get("/test", checkAuth, (req: Request, res: Response) => {
    console.log(res.locals.user);
    return res.send();
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
