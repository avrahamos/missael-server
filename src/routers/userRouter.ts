import { Router } from "express";
import { login, register } from "../controllers/userController";
const routr= Router()

routr.post('/login' , login)
routr.post('/register' , register)

export default routr