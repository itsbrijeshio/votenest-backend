import express from "express";
import cors from "cors";
import prisma from "./config/prisma";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("VoteNest API is running 🚀");
});

app.get("/db", async (req, res) => {
  const time = await prisma.$queryRaw`SELECT NOW()`;
  res.json({ time });
});

export default app;
