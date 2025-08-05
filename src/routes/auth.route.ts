import { Router } from "express";
import { AuthController } from "../controllers";
import { authMiddleware, validateMiddleware } from "../middlewares";
import { registerSchema, loginSchema } from "../schema/auth.schema";

const authController = new AuthController();

const router = Router();

router.post(
  "/register",
  validateMiddleware(registerSchema),
  authController.handleRegister
);
router.post(
  "/login",
  validateMiddleware(loginSchema),
  authController.handleLogin
);
router.get("/logout", authMiddleware, authController.handleLogout);
router.get("/me", authMiddleware, authController.handleGetUser);

export default router;
