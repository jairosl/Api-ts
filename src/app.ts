import express from "express";
import "reflect-metadata";
import createConnection from "./database";

createConnection();
const app = express();
app.use(express.json());

export { app };
