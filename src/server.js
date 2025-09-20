import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";
import allRoutes from "./routes/index.js";
import responseHelper from "./helpers/responseHelper.js";
import { generalLimiter } from "./middleware/rateLimiter.middleware.js";
import { HTTP_RESPONSES } from "./constants/http-response-messages.constants.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply global rate limiting
app.use(generalLimiter);

// Routes
app.use("/api", allRoutes);

// Health check
app.get("/health", (req, res) => {
  responseHelper.successResponse(res, HTTP_RESPONSES.HTTP_OK, "Healthy");
});

// 404 handler
app.use((req, res) => {
  responseHelper.errorResponse(
    res,
    HTTP_RESPONSES.HTTP_NOT_FOUND,
    "Route not found"
  );
});

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Sync models
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("✅ Models synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
