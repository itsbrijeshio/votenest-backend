import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { errorMiddleware, rateLimitMiddleware } from "./middlewares";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("combined"));
app.use(rateLimitMiddleware);

// Default endpoint
app.get("/", (req, res) => {
  res.send(`Welcome to VoteNest API!`);
});

// api endpoints
app.use("/api", routes);

// error handler
app.use(errorMiddleware);

export default app;
