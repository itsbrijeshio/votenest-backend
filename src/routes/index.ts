import { Router } from "express";
import authRoutes from "./auth";
import pollRoutes from "./poll";

const router = Router();

router.use("/auth", authRoutes);
router.use("/polls", pollRoutes);

export default router;
