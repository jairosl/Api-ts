/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface IJwtResponse {
  id: string;
  iat: number;
  exp: number;

}
class Auth {
  async verifyToken(request: Request, response: Response, next: NextFunction) {
    const token = request.headers;

    if (!token.authorization) {
      return response.status(401).json({ error: "No token provider" });
    }
    const tokenWithoutPrefix = token.authorization?.replace("Bearer ", "");

    const result = jwt.verify(tokenWithoutPrefix as string, process.env.SECRET as string);

    const { id } = result as IJwtResponse;
    request.userId = id;

    next();
  }
}

export { Auth };
