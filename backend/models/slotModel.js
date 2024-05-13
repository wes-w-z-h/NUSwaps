import mongoose from "mongoose";

const Schema = mongoose.Schema;
const slotSchema = new Schema(
  {
    courseID: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    lessonType: {
      type: String,
      required: true,
    },
    timing: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      default: "Location Unavailable",
    },
  },
  { timestamps: true } // createdAt option
);

const Slot = mongoose.model("Slot", slotSchema);
export { Slot, slotSchema };
