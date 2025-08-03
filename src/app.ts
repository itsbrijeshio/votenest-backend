import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import prisma from "./config/prisma";
import routes from "./routes";
import { errorHandler } from "./middlewares";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URI || "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(helmet())
app.use(morgan("combined"))
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("VoteNest API is running 🚀");
});

app.get("/db", async (req, res) => {
  const time = await prisma.$queryRaw`SELECT NOW()`;
  res.json({ time });
});

app.use("/api", routes);
app.use(errorHandler);

export default app;
