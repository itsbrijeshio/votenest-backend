import { rateLimit } from "express-rate-limit";

const rateLimitMiddleware = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

export default rateLimitMiddleware;
