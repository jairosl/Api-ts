import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import hash, { compareHash } from "../utils/hash";

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

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne({ id });

    if (!user) {
      return response.status(400).json({ error: "No User exists!" });
    }

    return response.json(user);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
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

    const user = await usersRepository.findOne({ id });

    if (!user) {
      return response.status(400).json({ error: "No User exists!" });
    }

    const hashPassword = await hash(password);

    const userUpdate = await usersRepository.save({
      id,
      email,
      name,
      telephone,
      password: hashPassword,
      birthdate,
      weight,
      ethnicity,
    });

    return response.json(userUpdate);
  }

  async delete(request: Request, response: Response) {
    const { password } = request.body;
    const { id } = request.params;

    if (!password) {
      return response.status(400).json({ error: "No password provider" });
    }
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne({ id });

    if (!user) {
      return response.status(400).json({ error: "No User exists!" });
    }

    if (!(await compareHash(user.password, password))) {
      return response.status(400).json({ error: "Password incorrect!" });
    }

    await usersRepository.delete(
      user,
    );

    return response.status(200).json();
  }
}

export { UserController };
