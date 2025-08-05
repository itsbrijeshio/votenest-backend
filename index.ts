import { connectDB, env } from "./src/config";
import app from "./src/app";

const PORT = env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.info(`Server is listening on port ${PORT}`);
  });
});
