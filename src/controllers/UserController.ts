import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import * as yup from "yup";

import { AppError } from "../errors/AppError";
import { UsersRepository } from "../repositories/UsersRepository";
import hash, { compareHash } from "../services/hash";

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

    const schema = yup.object().shape({
      email: yup.string().email("Email invalid").required("Email is required"),
      name: yup.string().required("Name is required"),
      telephone: yup.string().required("Telephone is required"),
      password: yup.string().min(5, "Must be exactly 5 digits").required("Password is required"),
      birthdate: yup.date().required("Birthdate is required"),
      weight: yup.number().required("Weight is required"),
      ethnicity: yup.string().required("ethnicity is required").oneOf(["branco", "pardo", "negro", "amarelo", "indigena", "outro"]),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(`${err.errors}`);
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });

    if (userAlreadyExists) {
      throw new AppError("User already exists");
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
      throw new AppError("User no exists");
    }

    return response.status(200).json(user);
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

    const schema = yup.object().shape({
      email: yup.string().email("email invalid").required("Email is required"),
      name: yup.string().required("Name is required"),
      telephone: yup.string().required("Telephone is required"),
      password: yup.string().min(5, "Must be exactly 5 digits").required("Password is required"),
      birthdate: yup.date().required("Birthdate is required"),
      weight: yup.number().required("Weight is required"),
      ethnicity: yup.string().required("ethnicity is required").oneOf(["branco", "pardo", "negro", "amarelo", "indigena", "outro"]),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(`${err.errors}`);
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne({ id });

    if (!user) {
      throw new AppError("No user exists");
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
      throw new AppError("No password provider");
    }
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne({ id });

    if (!user) {
      throw new AppError("No User exists!");
    }

    if (!(await compareHash(user.password, password))) {
      throw new AppError("Password incorrect!");
    }

    await usersRepository.delete(
      user,
    );

    return response.status(200).json();
  }
}

export { UserController };
