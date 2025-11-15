import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITodo extends Document {
  text: string;
  done: boolean;
  userId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const TodoSchema: Schema<ITodo> = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITodo>("Todo", TodoSchema);
