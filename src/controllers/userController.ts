import { Request, Response } from "express";
import { loginService, registerService } from "../services/usersService";
import { LoginDto, RegisterDto } from "../types/dto/loginDto";

export const login = async (req: Request, res: Response) => {
  try {
    const loggedUser = await loginService(req.body as LoginDto);
    res.status(200).json(loggedUser);
    console.log("1")
  } catch (error) {
    res.status(400).json((error as Error).message);
    console.log(error);
    console.log("2")
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const freshlyCreatedUser = await registerService(req.body as RegisterDto);
    res.status(201).json(freshlyCreatedUser);
  } catch (err) {
    res.status(400).json((err as Error).message);
  }
};
