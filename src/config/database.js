import mongoose from "mongoose";
import { MONGO_URL } from "./env.js";

export const connectDB = async () => {
  await mongoose.connect(MONGO_URL);
  console.log("MongoDB conectado");
};