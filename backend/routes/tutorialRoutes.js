import express from "express";

const tutRouter = express.Router();

tutRouter.get("/", (req, res) => {
  res.json({ message: "hello worlds" });
});

tutRouter.get("/:id", (req, res) => {
  res.json({ message: "hello world" });
});

tutRouter.post("/", (req, res) => {});

tutRouter.delete("/", (req, res) => {});

export { tutRouter };
