/* eslint-disable no-unused-vars */
import * as express from "express";

declare module "express" {
  export interface Request {
     userId?: string;
  }
}
