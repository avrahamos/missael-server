import { Router } from "express";
import { attack, getMyMissiles } from "../controllers/teroristController";
import { onlyTerorist } from "../middlewares/veryfyUsers";
const routr = Router();

routr.get('/:organizationId',onlyTerorist,getMyMissiles)
routr.post("/:organizationId/:attak",onlyTerorist ,attack);

export default routr;
