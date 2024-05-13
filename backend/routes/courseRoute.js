import express from "express";
import { Course } from "../models/courseModel.js";

const courseRouter = express.Router();

courseRouter.get("/", (req, res) => {
  res.json({ message: "hello worlds" });
});

courseRouter.get("/:id", (req, res) => {
  res.json({ message: "hello world" });
});

courseRouter.post("/", async (req, res) => {
  const { courseID, description, slots } = req.body;
  try {
    const course = await Course.create({ courseID, description, slots });
    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

courseRouter.delete("/", (req, res) => {});

export { courseRouter };
