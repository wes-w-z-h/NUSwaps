import express from "express";
import "dotenv/config";

const app = express();

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.get("/", (req, res) => {
  //   console.log(req.body);
  res.json({ message: "hello world" });
});

app.listen(process.env.PORT, () => {
  console.log("listening on port", process.env.PORT);
});
