import express from "express";
import { Slot } from "../models/slotModel.js";

const slotRouter = express.Router();

slotRouter.get("/", (req, res) => {
  res.json({ message: "hello worlds" });
});

slotRouter.get("/:id", (req, res) => {
  res.json({ message: "hello world" });
});

slotRouter.post("/", async (req, res) => {
  const { courseID, description, timing, location } = req.body;
  try {
    const slot = await Slot.create({ courseID, description, timing, location });
    res.status(200).json(slot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

slotRouter.delete("/", (req, res) => {});

export { slotRouter };
