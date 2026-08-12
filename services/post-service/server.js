import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import postRoutes from "./routes/post.route.js";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 5003;

app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use("/api/posts", postRoutes);
app.get("/health", (_req, res) => {
  res.status(200).json({
    service: "post-service",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});


async function startServer() {
  await connectDB();

  app.listen(port, "0.0.0.0",() => {
    console.log(`Post service listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Unable to start post service:", error.message);
  process.exit(1);
});
