import "dotenv/config";
import express from "express";
import { tutRouter } from "./routes/tutorialRoute.js";
import mongoose from "mongoose";

const app = express();

// middleware
app.use(express.json());
// to check the req routes
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/tutorials", tutRouter);

// connect db
// TODO: add the uri
// mongoose.connect(uri)
// .then(() => app.listen(process.env.PORT, () => {
// console.log("listening on port", process.env.PORT);
// });)
// .catch((error) => console.log(error)); add env variable for uri
