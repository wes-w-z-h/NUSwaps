import "dotenv/config";
import express from "express";
import { tutRouter } from "./routes/tutorialRoutes.js";

const app = express();

// to check the req routes
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/tutorials", tutRouter);

app.listen(process.env.PORT, () => {
  console.log("listening on port", process.env.PORT);
});
