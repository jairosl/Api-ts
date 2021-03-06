import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AddressRepository } from "../repositories/AddressRepository";

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

    const addressAlreadyExists = await addressRepository.findOne({
      where: {
        street: "Rua any",
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
}

export { AddressController };
