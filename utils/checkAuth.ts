import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type JwtPayload = { _id: string; iat: number; exp: number };

export default (req: Request, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization || "").toString().replace(/Bearer \s?/, "");

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, "secretKey") as JwtPayload;

    req.body.userId = decoded._id;

    next();
  } catch (e) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
