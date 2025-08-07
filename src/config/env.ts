import { config } from "dotenv";

config();

const env = {
  NODE_ENV: process.env.NODE_ENV as string,
  PORT: process.env.PORT as string,
  MONGO_URI: process.env.MONGO_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
};

export default env;
