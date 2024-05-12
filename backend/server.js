import "dotenv/config";
import express from "express";
import { tutRouter } from "./routes/tutorialRoute.js";
import mongoose from "mongoose";

const app = express();

// Middleware
app.use(express.json());
// to check the req routes
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/tutorials", tutRouter);

// Connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("listening on port", process.env.PORT);
    }
  )})
  .catch((error) => console.log(error));
