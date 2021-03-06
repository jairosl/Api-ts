import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import hash from "../utils/hash";

class UserController {
  async create(request: Request, response: Response) {
    const {
      email,
      name,
      telephone,
      password,
      birthdate,
      weight,
      ethnicity,
    } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });

    if (userAlreadyExists) {
      return response.status(400).json({ error: "User already exists" });
    }

    const hashPassword = await hash(password);

    const user = usersRepository.create({
      email,
      password: hashPassword,
      name,
      telephone,
      birthdate,
      weight,
      ethnicity,
    });

    await usersRepository.save(user);

    return response.status(201).json(user);
  }
}

export { UserController };
