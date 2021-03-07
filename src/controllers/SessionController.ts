import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { UsersRepository } from "../repositories/UsersRepository";
import { compareHash } from "../services/hash";
import { createJwtToken } from "../services/jwt";

class SessionController {
  async singIn(request: Request, response: Response) {
    const { email, password } = request.body;

    const userRepository = getCustomRepository(UsersRepository);

    if (!email || !password) {
      throw new AppError("Missing email or password provider");
    }

    const user = await userRepository.findOne({ email });

    if (!user) {
      throw new AppError("User not exists");
    }

    const passwordCompareHash = await compareHash(user?.password as string, password);

    if (!passwordCompareHash) {
      throw new AppError("email or password invalid");
    }

    const tokenJwt = await createJwtToken(user?.id as string);

    return response.json({ token: tokenJwt });
  }
}

export { SessionController };
