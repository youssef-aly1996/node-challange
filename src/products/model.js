import { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
  {
    amountAvailable: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      enum: [5, 10, 20, 50, 100],
      required: true,
    },
    productName: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 320,
      required: true,
    },
    sellerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Product", productSchema);
