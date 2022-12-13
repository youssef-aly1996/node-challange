import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    deposite: {
      type: Number,
      default: 0,
    },
    userName: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 200,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 50,
      maxlength: 320,
      required: true,
    },
    role: {
      type: String,
      trim: true,
      enum: ["seller", "buyer"],
      required: true,
    },
  },
  { timestamps: true }
);

export default model("User", userSchema);
