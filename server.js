import express from "express";
import bodyParser from "body-parser";
import { sequelize } from "./src/models/sequelize.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import userGuidesRoutes from "./src/routes/userGuides.routes.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import "./src/models/index.js";

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
app.use("/api/userGuides", userGuidesRoutes)

const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf8"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = 3000;

sequelize.sync().then(() => {
  console.log('Tables créées :', Object.keys(sequelize.models));
  app.listen(PORT, () => {
    console.log(`🚀 POC server running on http://localhost:${PORT}`);
  });
});
