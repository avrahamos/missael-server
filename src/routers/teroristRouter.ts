import { Router } from "express";
import { attack, getMyMisseles } from "../controllers/teroristController";
const routr = Router();

routr.get('/:organizationId',getMyMisseles)
routr.post("/:organizationId/:attak" ,attack);

export default routr;
