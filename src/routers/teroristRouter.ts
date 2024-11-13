import { Router } from "express";
import { attack, getMyMissiles } from "../controllers/teroristController";
const routr = Router();

routr.get('/:organizationId',getMyMissiles)
routr.post("/:organizationId/:attak" ,attack);

export default routr;
