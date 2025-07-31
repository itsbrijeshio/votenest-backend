import app from "./src/app";
import { config } from "dotenv";

config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.info(`Server running at http://localhost:${PORT}`);
});
