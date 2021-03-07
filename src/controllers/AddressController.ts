import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AddressRepository } from "../repositories/AddressRepository";
import { UsersRepository } from "../repositories/UsersRepository";

class AddressController {
  async create(request: Request, response: Response) {
    const id = request.userId;
    const {
      street,
      district,
      number,
      complement,
      cep,
      city,
      state,
    } = request.body;

    const addressRepository = getCustomRepository(AddressRepository);

    const userRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = userRepository.findOne({ id });

    if (!userAlreadyExists) {
      return response.status(400).json({ error: "User no exists" });
    }

    const addressAlreadyExists = await addressRepository.findOne({
      where: {
        street,
        district,
        city,
        state,
        number,
        cep,
        user_id: id,
      },
      relations: ["user"],
    });

    if (addressAlreadyExists) {
      return response.status(400).json({ error: "Address already exists" });
    }

    const address = addressRepository.create({
      street,
      district,
      city,
      state,
      number,
      cep,
      complement,
      user_id: id,
    });

    await addressRepository.save(address);

    return response.status(201).json(address);
  }

  async show(request: Request, response: Response) {
    const id = request.userId;
    const { id: idAddress } = request.params;

    const addressRepository = getCustomRepository(AddressRepository);

    const userRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = userRepository.findOne({ id });

    if (!userAlreadyExists) {
      return response.status(400).json({ error: "User no exists" });
    }

    const address = await addressRepository.findOne({
      where: {
        id: idAddress,
      },
      relations: ["user"],
    });

    if (!address) {
      return response.status(400).json({ error: "Address no exists" });
    }

    return response.json(address);
  }

  async update(request: Request, response: Response) {
    const id = request.userId;
    const {
      street,
      district,
      number,
      complement,
      cep,
      city,
      state,
    } = request.body;
    const { id: idAddress } = request.params;

    const addressRepository = getCustomRepository(AddressRepository);

    const userRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = userRepository.findOne({ id });

    if (!userAlreadyExists) {
      return response.status(400).json({ error: "User no exists" });
    }

    const addressAlreadyExists = await addressRepository.findOne({
      where: {
        id: idAddress,
      },
      relations: ["user"],
    });

    if (!addressAlreadyExists) {
      return response.status(400).json({ error: "Address no exists" });
    }

    const addressUpdate = await addressRepository.save({
      id: idAddress,
      street,
      district,
      number,
      complement,
      cep,
      city,
      state,
    });

    return response.status(200).json(addressUpdate);
  }

  async delete(request: Request, response: Response) {
    const id = request.userId;
    const { id: idAddress } = request.params;

    const addressRepository = getCustomRepository(AddressRepository);

    const userRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = userRepository.findOne({ id });

    if (!userAlreadyExists) {
      return response.status(400).json({ error: "User no exists" });
    }

    const address = await addressRepository.findOne({
      where: {
        id: idAddress,
      },
      relations: ["user"],
    });

    if (!address) {
      return response.status(400).json({ error: "Address no exists" });
    }

    await addressRepository.remove(address);

    return response.json();
  }
}

export { AddressController };
