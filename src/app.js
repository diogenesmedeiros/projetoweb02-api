import express from "express";
import animeRoutes from "./routes/anime.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const frontend_url = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

app.get("/ping", (req, res) => {
  try {
    res.json({ status: "success", message: "Pong" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Health check failed",
      error: error.message,
    });
  }
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/anime", animeRoutes);

app.listen(3000, "0.0.0.0", async () => {
  console.log("Server running");
});
