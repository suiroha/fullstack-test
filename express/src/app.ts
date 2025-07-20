import express, { Request, Response } from "express";
import cors from "cors";
import CookieParser from "cookie-parser";
import initializeConnection from "../database/connection";
import checkUser from "../middleware/checkUser";
import { signJwt, verifyJwt } from "../auth/jwt";
import { reqUser } from "../types/Req";

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
app.get("/", async (req: Request, res: Response) => {
  console.log("api hit on / GET");
  try {
    const { getUser } = await initializeConnection();
    console.log("Fetching users from database");
    const data = await getUser();
    console.log("Data retrieved:", data);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/data", checkUser, async (req: reqUser, res: Response) => {
  console.log("api hit on /data GET"); 
  const {user} = req;
  // console.log("Payload from cookies:", user);
  const { loginGet } = await initializeConnection();
  // release();
  if (!user) {
    res.status(401).json({ error: "Unauthorized access" });
    return;
  }
  try {
    const userId = typeof user.id === "string" || typeof user.id === "number" ? user.id : "";
    const result = await loginGet("SELECT * FROM reduce", userId);
    if (result.length === 0) {
      console.log(result);
      res.status(404).json({ error: "No data found for this user" });
      return;
    }
    console.log("Data retrieved:", result);
    res.json(result);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
  
});

app.post("/data", checkUser, async (req: reqUser, res: Response) => {
  console.log("api hit on /data POST");
  const { user } = req;
  const { name, description, amount } = req.body;
  const { post } = await initializeConnection();
  if (!name || !description || !amount) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  if (typeof amount !== "number") {
    res.status(400).json({ error: "Amount must be a number" });
    return;
  }
  if (!user) {
    res.status(401).json({ error: "Unauthorized access" });
    return;
  }
  try {
    const userId = typeof user.id === "string" ? user.id : String(user.id);
    const result = await post(userId, name, description, amount);
    if (result === 0) {
      res.status(500).json({ error: "Failed to post data" });
      return;
    }
  } catch (error) {
    console.error("Error posting data:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  // console.log("Received data:", { name, description, amount });
  // console.log("Token:", user);

  // const payload = await verifyJwt(token);
  res.json({
    message: "Protected data posted",
  });
});

app.post("/login", async (req: Request, res: Response) => {
  console.log("api hit on /login POST");
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
    const { getUser } = await initializeConnection();
    // (await initializeConnection()).release()
    const users = await getUser(email);
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
  console.log("api hit on /verify GET");
  const { token } = req.cookies;
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    console.log("No token provided");
    return;
  }
  // console.log(token);
  try { 
    const payload = await verifyJwt(token);
    res.json({ message: "Token is valid", payload });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default app;
