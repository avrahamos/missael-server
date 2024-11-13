import  { compare , hash } from "bcrypt";
import User from "../models/userModel";
import { LoginDto, RegisterDto } from "../types/dto/loginDto";
import jwt from "jsonwebtoken";

export const loginService = async (user: LoginDto) => {
  try {
    const userFromDatabase = await User.findOne({ email: user.email });
    if (!userFromDatabase) {
      throw new Error("User not found");
    }

    const match = await compare(user.password, userFromDatabase.password);
    if (!match) {
      throw new Error("Wrong password");
    }

    const token = jwt.sign(
      {
        userId: userFromDatabase._id,
        email: userFromDatabase.email,
        organization: userFromDatabase.organization,
        location: userFromDatabase.location,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "20m" }
    );

    return { ...userFromDatabase.toObject(), token, password: undefined };
  } catch (error) {
    throw error;
  }
};
export const registerService = async (user: RegisterDto) => {
  try {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await hash(user.password, 10);

    const newUser = new User({
      userName: user.userName,
      email: user.email,
      password: hashedPassword,
      organization: user.organization,
      location: user.organization === "IDF" ? user.location : undefined,
    });

    await newUser.save();

    return {
      userName: newUser.userName,
      email: newUser.email,
      organization: newUser.organization,
      location: newUser.location || null,
    };
  } catch (error) {
    throw error;
  }
};