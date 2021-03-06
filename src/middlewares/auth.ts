import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface IJwtResponse {
  id: string;
  iat: number;
  exp: number;

}
class Auth {
  verifyToken(request: Request, response: Response, next: NextFunction) {
    const token = request.headers;

    if (!token) {
      return response.status(401).json({ error: "No token provider" });
    }
    const tokenWithoutPrefix = token.authorization?.replace("Bearer ", "");

    jwt.verify(tokenWithoutPrefix as string, process.env.SECRET as string, (err, decoded) => {
      if (err) return response.status(500).json({ message: "Failed to authenticate" });
      const { id } = decoded as IJwtResponse;
      request.userId = id;
      return next();
    });

    return next();
  }
}

export { Auth };
