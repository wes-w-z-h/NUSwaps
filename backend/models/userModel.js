import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    tutSlots: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true } // createdAt option
);

export const User = mongoose.model("User", userSchema);
