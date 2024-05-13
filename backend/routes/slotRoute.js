import express from "express";
import { Slot } from "../models/slotModel.js";
import { getHandler, postHandler } from "../controllers/requestHandlers.js";

const slotRouter = express.Router();

slotRouter.get("/", getHandler(Slot));

slotRouter.get("/:id", (req, res) => {
  res.json({ message: "hello world" });
});

slotRouter.post("/", postHandler(Slot));

slotRouter.delete("/", (req, res) => {});

export { slotRouter };
