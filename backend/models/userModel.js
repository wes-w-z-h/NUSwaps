import mongoose from "mongoose";
import { swapSchema } from "./swapModel.js";

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    userID: {
      type: Number,
      reuired: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
      // default: "",
    },
    swapRequests: {
      type: [swapSchema], // default is an empty array
      required: false,
    },
  },
  { timestamps: true } // createdAt option
);

export const User = mongoose.model("User", userSchema);
