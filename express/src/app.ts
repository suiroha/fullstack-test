import express, { Request, Response } from "express";
import cors from "cors";
import CookieParser from "cookie-parser";
import initializeConnection from "../database/connection";
import checkUser from "../middleware/checkUser";
import { signJwt, verifyJwt } from "../auth/jwt";

const app = express();
app.use(CookieParser());

// Middleware
app.use(
  cors({
    origin: "https://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

// Routes
app.get("/", async (_req: Request, res: Response) => {
  try {
    const { get } = await initializeConnection();
    const data = await get("SELECT * FROM users");
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/data", checkUser, async (_req: Request, res: Response) => {
  res.status(201).json({ success: true });
});

app.post("/login", async (req: Request, res: Response) => {
  const { email, name, id } = req.body;
  if (!email || !name || !id) {
    res.status(400).json({ error: "Missing user data" });
    return;
  }
  if (!email.includes("@")) {
    res.status(400).json({ error: "Invalid email format" });
    return;
  }

  try {
    const { get } = await initializeConnection();
    const users = await get("SELECT id FROM users WHERE email = $1", [email]);
    if (users[0].id !== id) {
      res.status(401).json({ error: "User ID does not match" });
      return;
    }

    const jwt = await signJwt({ email, name, id }, "1h");
    res.cookie("token", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600000,
    });
    res.json({
      message: "Login successful",
      user: { email, name, id },
    });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/verify", async (req: Request, res: Response) => {
  const { token } = req.cookies;
  if( !token) {
    res.status(401).json({ error: "No token provided" });
    console.log("No token provided")
    return 
  }
  console.log(token)
  try {
    const payload = await verifyJwt(token);
    res.json({ message: "Token is valid", payload });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default app;
