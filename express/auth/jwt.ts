import { jwtVerify, SignJWT } from "jose";
import type { JWTPayload } from "jose";

const encoder = new TextEncoder();
const secret = encoder.encode(process.env.SUPER_SECRET_JWT || "rahasia_super");


const signJwt = async (payload: JWTPayload, expiresIn: string) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

const verifyJwt = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    throw new Error("Invalid token");
  }
};

export { signJwt, verifyJwt };


