import { Request, Response, NextFunction } from "express";

interface User {
  name: string;
  email: string;
  id: string;
}

const checkUser = (req: Request, res: Response, next: NextFunction) => {
  const user: User = req.body;
  console.log("User data:", user);
  if (!user || !user.name || !user.email || !user.id) {
    res.status(400).json({ error: "Invalid user data" });
    return;
  }
  next();
};

export default checkUser;
