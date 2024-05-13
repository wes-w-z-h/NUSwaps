import mongoose from "mongoose";
import { slotSchema } from "./slotModel.js";

const Schema = mongoose.Schema;
const swapSchema = new Schema(
  {
    swapID: {
      type: Number,
      required: true,
    },
    userID: {
      type: Number,
      required: true,
    },
    courseID: {
      type: String,
      required: true,
    },
    current: {
      type: slotSchema,
      required: true,
    },
    request: {
      type: slotSchema,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true } // createdAt option
);

const Swap = mongoose.model("Swap", swapSchema);
export { Swap, swapSchema };
