import mongoose from "mongoose";
import { slotSchema } from "./slotModel.js";

const Schema = mongoose.Schema;
const courseSchema = new Schema(
  {
    courseID: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slots: {
      type: [slotSchema],
      required: true,
    },
  },
  { timestamps: true } // createdAt option
);

export const Course = mongoose.model("Course", courseSchema);
