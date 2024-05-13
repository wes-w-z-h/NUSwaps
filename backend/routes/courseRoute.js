import express from "express";
import { Course } from "../models/courseModel.js";
import { getHandler, postHandler } from "../controllers/requestHandlers.js";

const courseRouter = express.Router();

courseRouter.get("/", getHandler(Course));

courseRouter.get("/:id", (req, res) => {
  res.json({ message: "hello world" });
});

courseRouter.post("/", postHandler(Course));

courseRouter.delete("/", (req, res) => {});

export { courseRouter };
