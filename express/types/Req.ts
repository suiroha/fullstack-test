import { Request } from "express";
import { JWTPayload } from "jose";

export interface reqUser extends Request {
  user?:
    | {
        id: number;
        name: string;
        email: string;
      }
    | JWTPayload;
}
