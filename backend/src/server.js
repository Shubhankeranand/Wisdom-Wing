import dotenv from "dotenv";
import mongoose from "mongoose";
import { createApp } from "./app.js";

dotenv.config();

const app = createApp();

let isConnected = false;

// Connect to MongoDB once per cold start
const connectToDB = async () => {
  if (!isConnected && process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
    }
  }
};

// Vercel serverless function entrypoint
export default async function handler(req, res) {
  await connectToDB();
  return app(req, res);
}

// Fallback for local development if run directly
if (process.env.NODE_ENV !== "production") {
  const port = Number(process.env.PORT ?? 5001);
  connectToDB().then(() => {
    app.listen(port, () => {
      console.log(`Wisdom Wing API listening on port ${port}`);
    });
  });
}
