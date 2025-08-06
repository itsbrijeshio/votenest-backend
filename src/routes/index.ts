import { Router } from "express";
import authRoute from "./auth.route";
import pollRoute from "./poll.route";

const router = Router();

router.use("/auth", authRoute);
router.use("/polls", pollRoute);

export default router;
