import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";


import User, { IUser } from "../models/User";

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

interface AuthRequestBody {
  username?: string;
  email: string;
  password: string;
}

// REGISTER
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body as AuthRequestBody;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user: IUser = await User.create({
      username,
      email,
      password: hashed,
    });

    return res.json({ message: "User registered", user });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as AuthRequestBody;

    const user: IUser | null = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Logged in successfully",
      token,
      userId: user._id,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// AUTH CHECK
router.get("/me", (req: Request, res: Response) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    return res.json({ userId: decoded.userId });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// SIGNOUT
router.post("/signout", (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  return res.json({ message: "Signed out successfully" });
});

//Forgot
router.post("/forgot", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email not found" });

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    // Frontend reset password URL
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Todo App <onboarding@resend.dev>",
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <p>You requested to reset your password.</p>
        <p>Click the link below to set a new password:</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    // If sending failed
    if (emailResponse.error) {
      return res.status(500).json({ message: emailResponse.error.message });
    }

    return res.json({ message: "Reset link sent to your email" });

  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// RESET PASSWORD
router.post("/reset/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }, // still valid
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({ message: "Password reset successful" });

  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});



export default router;
