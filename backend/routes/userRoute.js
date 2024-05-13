import express from "express";
import { User } from "../models/userModel.js";
import { getHandler, postHandler } from "../controllers/requestHandlers.js";

const userRouter = express.Router();

userRouter.get("/", getHandler(User));

userRouter.get("/:id", (req, res) => {
  res.json({ message: "hello world" });
});

userRouter.post("/", postHandler(User));

userRouter.delete("/", (req, res) => {});

export { userRouter };
