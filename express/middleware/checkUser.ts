import { Response, NextFunction } from "express";
import { verifyJwt } from "../auth/jwt";
import { reqUser } from "../types/Req";

const checkUser = async (req: reqUser, res: Response, next: NextFunction) => {
  const {token} = req.cookies;
  if (!token) {
    res.status(401).json({ error: "Unauthorized access" });
    return;
  }
  try {
    const payload = await verifyJwt(token);
    console.log("JWT payload:", payload);
    req.user = payload; // Store the payload in the request object
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  next();
};

export default checkUser;
