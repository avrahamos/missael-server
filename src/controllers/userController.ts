import { Request, Response } from "express";
import { loginService, registerService } from "../services/usersService";
import { LoginDto, RegisterDto } from "../types/dto/loginDto";
import userModel, { IUser } from "../models/userModel";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  try {
    const loggedUser = await loginService(req.body as LoginDto);
    res.status(200).json(loggedUser);
  } catch (error) {
    res.status(400).json((error as Error).message);
    console.error(error);
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

export const getUserProfile = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Token is required" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const user: IUser | null = await userModel.findById(decoded.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      userName: user.userName,
      email: user.email,
      organization: user.organization,
      location: user.location,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
