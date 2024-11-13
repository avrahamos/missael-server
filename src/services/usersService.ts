import { compare } from "bcrypt";
import soldierModel from "../models/soldierModel";
import teroristModel from "../models/teroristModel";
import { LoginDto, RegisterDto } from "../types/dto/loginDto";
import jwt from "jsonwebtoken";

export const loginService = async (user: LoginDto) => {
  try {
    let userFromDatabase = await soldierModel.findOne({
      userName: user.userName,
    });
    const location = userFromDatabase?.location;
    if (!userFromDatabase) {
      userFromDatabase = await teroristModel.findOne({
        userName: user.userName,
      });
      if (!userFromDatabase) {
        throw new Error("user not found");
      }
    }
    const match = await compare(user.password, userFromDatabase.password);
    if (!match) throw new Error("wrong password");
    const token = jwt.sign(
      {
        userId: userFromDatabase._id,
        userName: userFromDatabase.userName,
        organization: userFromDatabase.organization,
        location,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "20m",
      }
    );
    return { ...userFromDatabase, token, password: "**********" };
  } catch (error) {
    throw error;
  }
};

export const registerService = (user:RegisterDto) => {
  try {
  } catch (error) {}
};
