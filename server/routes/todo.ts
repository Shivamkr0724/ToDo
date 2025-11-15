import { Router, Request, Response } from "express";
import Todo, { ITodo } from "../models/Todo";
import authorize, { AuthRequest } from "../middlewares/auth";

const router = Router();

// GET all todos (protected)
router.get("/", authorize, async (req: AuthRequest, res: Response) => {
  try {
    const todos: ITodo[] = await Todo.find({ userId: req.user!._id })
      .sort({ createdAt: -1 });

    return res.json(todos);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// CREATE todo
router.post("/", authorize, async (req: AuthRequest, res: Response) => {
  try {
    const todo: ITodo = await Todo.create({
      text: req.body.text,
      userId: req.user!._id,
    });

    return res.json(todo);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// UPDATE todo
router.put("/:id", authorize, async (req: AuthRequest, res: Response) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      req.body,
      { new: true }
    );

    return res.json(todo);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// DELETE todo
router.delete("/:id", authorize, async (req: AuthRequest, res: Response) => {
  try {
    await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!._id,
    });

    return res.json({ message: "Todo deleted" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
