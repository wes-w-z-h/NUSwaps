import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import { userRouter } from "./routes/userRoute.js";
import { slotRouter } from "./routes/slotRoute.js";
import { courseRouter } from "./routes/courseRoute.js";
import { swapRouter } from "./routes/swapRoutes.js";

const app = express();

// Middleware
app.use(express.json());
// to check the req routes
app.use((req, res, next) => {
  console.log(req.path, req.method);
  // next();
});

// Routes
app.use("/api/slots", slotRouter);
app.use("/api/courses", courseRouter);
app.use("/api/swaps", swapRouter);
app.use("/api/users", userRouter);

// Connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("listening on port", process.env.PORT);
    });
  })
  .catch((error) => console.log(error));
