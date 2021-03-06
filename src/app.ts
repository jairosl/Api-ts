import express from "express";
import "reflect-metadata";
import createConnection from "./database";
import { router } from "./route";

createConnection();
const app = express();
app.use(express.json());

app.use(router);

export { app };
