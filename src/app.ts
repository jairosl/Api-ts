import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import "reflect-metadata";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import createConnection from "./database";
import { router } from "./route";
import { AppError } from "./errors/AppError";

dotenv.config();

createConnection();

const app = express();

app.use(cors({
  origin: "*",
}));

app.use(helmet());

app.use(express.json());

app.use(router);

// eslint-disable-next-line no-unused-vars
app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message,
    });
  }

  return response.status(500).json({
    status: "Error",
    message: `Ìnternal server Error ${err.message}`,
  });
});

export { app };
