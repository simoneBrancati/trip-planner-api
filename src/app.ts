import express, { Express } from "express";
import router from "./frameworks/express/Router";
import loggingMiddleware from "./frameworks/express/middlewares/Logger";
import dotenv from "dotenv";
import logger from "./utils/Logger";
import tripErrorHandler from "./frameworks/express/middlewares/TripErrorHandler";
import globalErrorHandler from "./frameworks/express/middlewares/GlobalErrorHandler";

dotenv.config();

const app: Express = express();

// Custom logger
app.use(loggingMiddleware);

app.use(express.json());

app.use("/trip-planner/", router);

// Error Handler for the trip-planner routes
app.use("/trip-planner/", tripErrorHandler);

// Generic error handler
app.use(globalErrorHandler);

app.listen(process.env.APP_PORT, () => {
  logger.info(`Listening on port ${process.env.APP_PORT}`);
});

export default app;
