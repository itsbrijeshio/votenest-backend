import { config } from "dotenv";
config();

import app from "./src/app";
import { connectDB } from "./src/config";

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.info(`Server is listening on port ${PORT}`);
  });
});
