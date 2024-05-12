import express from "express";
import { User } from "../models/userModel.js";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.json({ message: "hello worlds" });
});

userRouter.get("/:id", (req, res) => {
  res.json({ message: "hello world" });
});

userRouter.post("/", async (req, res) => {
  const { username, tutSlots } = req.body;
  try {
    const user = await User.create({ username, tutSlots });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userRouter.delete("/", (req, res) => {});

export { userRouter };
