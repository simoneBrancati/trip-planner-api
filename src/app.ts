import express, { Express } from "express";
import router from "./frameworks/express/router";
import loggingMiddleware from "./frameworks/express/middlewares/logger";
import dotenv from "dotenv";
import logger from "./utils/logger";

dotenv.config();

const app: Express = express();

// Custom logger
app.use(loggingMiddleware);

app.use("/", router);

app.listen(process.env.APP_PORT, () => {
  logger.info(`Listening on port ${process.env.APP_PORT}`);
});

export default app;
