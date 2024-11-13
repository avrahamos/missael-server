import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

const verifyToken = (req: Request, res: Response): string | null => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({ error: "Token must be provided" });
    return null;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Invalid token format" });
    return null;
  }

  return token;
};

export const onliIdf = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = verifyToken(req, res);
    if (!token) return;

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    if (payload.organization !== "IDF") {
      res.status(403).json({ error: "Access denied: IDF only" });
      return;
    }

    (req as any).user = payload;
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({ error: "Invalid token" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const onlyTerorist = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = verifyToken(req, res);
    if (!token) return;

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    if (payload.organization === "IDF") {
      res.status(403).json({ error: "Access denied: Terorists only" });
      return;
    }

    (req as any).user = payload;
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({ error: "Invalid token" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
