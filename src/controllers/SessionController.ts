import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import { compareHash } from "../utils/hash";
import { createJwtToken } from "../utils/jwt";

class SessionController {
  async singIn(request: Request, response: Response) {
    const { email, password } = request.body;

    const userRepository = getCustomRepository(UsersRepository);

    if (!email || !password) {
      return response.status(400).json({ error: "Missing email or password provider" });
    }

    const user = await userRepository.findOne({ email });

    if (!user) {
      response.status(400).json({ error: "User not exists" });
    }

    const passwordCompareHash = await compareHash(user?.password as string, password);

    if (!passwordCompareHash) {
      return response.status(400).json({ error: "email or password invalid" });
    }

    const tokenJwt = await createJwtToken(user?.id as string);

    return response.json({ token: tokenJwt });
  }
}

export { SessionController };
