import express from "express";
import "reflect-metadata";
import dotenv from "dotenv";
import createConnection from "./database";
import { router } from "./route";

dotenv.config();

createConnection();

const app = express();

app.use(express.json());

app.use(router);

export { app };
