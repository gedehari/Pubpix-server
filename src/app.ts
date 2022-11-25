import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, urlencoded } from "express";

import user from "routes/user.route";
import { initDatabase } from "orm/dataSource";
import { checkAuth } from "controllers/auth.controller";

initDatabase();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(urlencoded({extended: true}));

app.use(express.static("public"));

app.use("/user", user);

app.get("/", (req: Request, res: Response) => {
    return res.send();
});

app.get("/test", checkAuth, (req: Request, res: Response) => {
    console.log(res.locals.user);
    return res.send();
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
