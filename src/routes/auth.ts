import { Router } from "express";
import { AuthController } from "../controllers";
import { authGuard, validateRequest as validate } from "../middlewares";
import { registerSchema, loginSchema } from "../schema/auth.schema";

const router = Router();

const authController = new AuthController();

router.post(
  "/register",
  validate(registerSchema),
  authController.handleRegister
);
router.post("/login", validate(loginSchema), authController.handleLogin);
router.get("/logout", authGuard, authController.handleLogout);
router.get("/me", authGuard, authController.handleGetMe);

export default router;
