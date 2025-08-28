import express from "express";
import bodyParser from "body-parser";
import { sequelize } from "./src/models/index.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";

const app = express();
app.use(bodyParser.json());

// Each requests shown in the console
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    if (body && body.error) {
      console.log(`⬅️  ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${body.error}`);
    } else {
      let successMsg = 'Success';
      if (body && (body.message || body.success)) {
        successMsg = body.message || body.success;
      }
      console.log(`⬅️  ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${successMsg}`);
    }
    return originalJson.call(this, body);
  };
  next();
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

const PORT = 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 POC server running on http://localhost:${PORT}`);
  });
});
