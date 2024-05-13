import express from "express";
import { Swap } from "../models/swapModel.js";

const swapRouter = express.Router();

swapRouter.get("/", (req, res) => {
  res.json({ message: "hello worlds" });
});

swapRouter.get("/:id", (req, res) => {
  res.json({ message: "hello world" });
});

swapRouter.post("/", async (req, res) => {
  const { swapID, courseID, lessonType, current, request, userID, status } = req.body;
  try {
    const swap = await Swap.create({
      swapID,
      courseID,
      lessonType,
      current,
      request,
      userID,
      status,
    });
    res.status(200).json(swap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

swapRouter.delete("/", (req, res) => {});

export { swapRouter };
