import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./utils/connectDB.js";
import authRoutes from "./routes/auth.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import notificationRoutes from "./routes/notifications.js";
import patternRoutes from "./routes/patterns.js";
import plannerRoutes from "./routes/planner.js";
import problemRoutes from "./routes/problems.js";
import userProblemRoutes from "./routes/userProblems.js";
import { startCronJobs } from "./utils/cronJobs.js";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = origin.replace(/\/+$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/user-problems", userProblemRoutes);
app.use("/api/patterns", patternRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/planner", plannerRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Server error";

  if (process.env.NODE_ENV !== "test") {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  res.status(status).json({ message });
});

const bootstrap = async () => {
  await connectDB();
  startCronJobs();

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server", error);
  process.exit(1);
});
