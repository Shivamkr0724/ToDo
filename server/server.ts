import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database/mongodb";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todo";

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 8000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://full-stack-todo-app-ten-omega.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

// Start server
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
