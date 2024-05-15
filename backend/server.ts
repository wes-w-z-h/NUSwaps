import app from "./app";
import "dotenv/config";
import env from "./util/validEnv";
import mongoose from "mongoose";

const PORT = env.PORT;

mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log("listening on port:", PORT));
  })
  .catch((error) => console.log(error));
