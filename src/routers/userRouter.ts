import { Router } from "express";
import { getUserProfile, login, register } from "../controllers/userController";
const userRoutr= Router()

userRoutr.post("/login", login);
userRoutr.post("/register", register);
userRoutr.get("/profile", getUserProfile);
export default userRoutr;