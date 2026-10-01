import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    published: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;