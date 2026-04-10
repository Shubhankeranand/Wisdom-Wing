import dotenv from "dotenv";
import mongoose from "mongoose";
import { createApp } from "./app.js";

dotenv.config();

const app = createApp();
const port = Number(process.env.PORT ?? 5000);

async function bootstrap() {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  app.listen(port, () => {
    console.log(`Wisdom Wing API listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
