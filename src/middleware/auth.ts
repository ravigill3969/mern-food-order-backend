import { auth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }
  
  const [_, token] = authorization.split(" ");
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    // console.log(decoded)
    const auth0Id = decoded.sub; //auth0Id
    // console.log(auth0Id)
    const user = await User.findOne({ auth0Id });
    // console.log(user)
    if (!user) {
      return res.sendStatus(401);
    }

    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
};
