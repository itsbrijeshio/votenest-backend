import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { errorMiddleware, rateLimitMiddleware } from "./middlewares";
import { success } from "zod";
import { serverMsg } from "./constants";

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

// page not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    status: 404,
    error: {
      type: "NOT_FOUND",
      message: serverMsg.PAGE_NOT_FOUND,
    },
  });
});

export default app;
