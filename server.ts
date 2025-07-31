import express from "express";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("VoteNest API is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.info(`Server running at http://localhost:${PORT}`);
});
