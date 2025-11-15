import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Extend Express Request to include user object
export interface AuthRequest extends Request {
  user?: IUser;
}

const authorize = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const token = header.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Fetch user without password
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user; // attach user to request
    next();

  } catch (error: any) {
    return res.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
};

export default authorize;
